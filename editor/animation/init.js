requirejs(['ext_editor_io2', 'jquery_190', 'raphael_210'],
    function (extIO, $) {
        function cup_stage_visualization(tgt_node, data) {
            if (!data || !data.ext) {
                return
            }
            /**
             * attr
             */
            const attr = {
                'stage_num': {
                    'target': {
                        'font-size': '10px',
                        'font-family': 'Times New Roman',
                        'stroke-width': '0',
                        'fill': '#294270',
                        'text-anchor': 'start',
                    },
                    'others': {
                        'font-size': '10px',
                        'font-family': 'Times New Roman',
                        'stroke-width': '0',
                        'fill': '#82D1F5',
                        'text-anchor': 'start',
                    },
                },
                'player_num': {
                    'target': {
                        'font-size': '10px',
                        'font-family': 'Times New Roman',
                        'stroke-width': '0',
                        'fill': '#294270',
                    },
                    'others': {
                        'font-size': '7px',
                        'font-family': 'Times New Roman',
                        'stroke-width': '0',
                        'fill': '#82D1F5',
                    },
                },
                'line': {
                    'target': {
                        'stroke': '#294270',
                        'stroke-width': '1.0px',
                    },
                    'others': {
                        'stroke': '#294270',
                        'stroke-width': '0.3px',
                    },
                },
            }
            /**
             * values
             */
            const [player_01, player_02, col_num] = data.in
            const answer = data.ext.answer
            const row_num = Math.log2(col_num) + 1
            const os = 15
            const col_unit = 200 / (col_num - 1)
            const row_unit = 140 / row_num
            const grid_size_px_w = 200
            const grid_size_px_h = row_unit * row_num
            /**
             * guard from big input
             */
            if (col_num > 100) {
                return
            }
            /**
             * paper
             */
            const paper = Raphael(tgt_node, grid_size_px_w + os * 2, grid_size_px_h + os * 2 + 15)
            /**
             * draw
             */
            // paper.rect(0, 0, grid_size_px_w + os * 2, grid_size_px_h + os * 2)
            for (let r = 1; r <= row_num; r += 1) {
                let sign = 1
                let left_margin = (2 ** (r - 2) - .5) * col_unit
                for (let c = 0; c < col_num / 2 ** (r - 1); c += 1) {
                    // draw horizontal line
                    let line_attr = attr.line.others
                    let start = c * 2 ** (r - 1) + 1
                    let end = (c + 1) * 2 ** (r - 1)
                    if (start <= player_01 && end >= player_01 &&
                        !(start <= player_02 && end >= player_02)
                        ||
                        !(start <= player_01 && end >= player_01) &&
                        start <= player_02 && end >= player_02
                    ) {
                        line_attr = attr.line.target
                    }
                    if (r < row_num) {
                        paper.path([
                            'M',
                            c * col_unit * (2 ** (r - 1)) + left_margin + os,
                            grid_size_px_h - r * row_unit + os,
                            'h', col_unit / 2 * sign * (2 ** (r - 1)),
                        ]).attr(line_attr)
                        sign *= -1
                    }
                    // draw stage number
                    let stage_num_attr = attr.stage_num.others
                    if (answer === 'final') {
                        if (r === row_num - 1) {
                            stage_num_attr = attr.stage_num.target
                        }
                    } else {
                        let stage_num_reg = /.*\/(\d+)$/.exec(answer)
                        let stage_num_int = parseInt(stage_num_reg[1], 10)
                        if (stage_num_int === 2 ** (row_num - r - 1)) {
                            stage_num_attr = attr.stage_num.target
                        }
                    }
                    if (r < row_num) {
                        paper.text(
                            2,
                            grid_size_px_h - r * row_unit + os,
                            r === row_num - 1 ? 'final' : 2 ** (row_num - r - 1)
                        ).attr(stage_num_attr)
                    }
                    // draw vertical line
                    paper.path([
                        'M',
                        c * col_unit * (2 ** (r - 1)) + left_margin + os,
                        grid_size_px_h - r * row_unit + os,
                        'v', row_unit,
                    ]).attr(line_attr)
                    // player number
                    if (r === 1) {
                        let player_num_attr = attr.player_num.others
                        if ([player_01, player_02].includes(c + 1)) {
                            player_num_attr = attr.player_num.target
                        }
                        paper.text(
                            c * col_unit * (2 ** (r - 1)) + left_margin + os,
                            grid_size_px_h - r * row_unit + os + row_unit + 5,
                            c + 1,
                        ).attr(player_num_attr)
                    }
                }
            }
        }
        var io = new extIO({
            animation: function ($expl, data) {
                cup_stage_visualization(
                    $expl[0],
                    data,
                );
            }
        });
        io.start();
    }
);
