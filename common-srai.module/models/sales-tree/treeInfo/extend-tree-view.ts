import * as Highcharts from 'highcharts';
import { Tree } from './Tree';
import * as  _ from 'lodash';

export class ExtendTreeView {

    public static distance = 0.0;
    constructor() { }

    public distanceWidth(width: number) {
        ExtendTreeView.distance = width;
    }

    public bindTreeView = () => {
        const H = Highcharts;
        H['seriesType']('tree', 'pie', {},
            {
                defaultConfig: {
                    node: {
                        width: 220,
                        height: null, // null = auto-calculated
                        marginX: 20,
                        marginY: 20,
                        backgroundColor: '#f2f2f2',
                        title: {
                            marginY: 4
                        },
                        row: {
                            width: 20,
                            height: 20,
                            marginX: 4
                        }
                    },
                    connector: {
                        color: '#bcbcbc',
                        width: 4
                    },
                    legend: {
                        marginX: 0,
                        marginY: 25
                    },
                    textColor: '#454d59',
                    rows: null
                },

                translate: function () {
                    const chart = _.cloneDeep(this.chart),
                        options = this.options,
                        data = options.data[0],
                        ren = chart.renderer,
                        colors = chart.options.colors;
                    let elements = this._elements,
                        maxX = 0, maxY = 0;


                    if (typeof (elements) === 'undefined') { this._elements = elements = []; }

                    const config = H['merge'](this.defaultConfig, chart.userOptions.chart.config, options.config);
                    // tslint:disable-next-line:no-shadowed-variable
                    const drawNode = function (elements: any, node: any, colors: any, add: any = 1) {

                        const box = {
                            x: (node.x) * (config.node.width + config.node.marginX),
                            y: node.y * (config.node.height + config.node.marginY),
                            w: config.node.width,
                            h: config.node.height
                        };

                        maxX = Math.max(maxX, box.x + box.w);
                        maxY = Math.max(maxY, box.y + box.h);
                        const chunk = function (str: any, size: any) {
                            return [].concat.apply([],
                                str.split('').map(function (x: any, i: any) {
                                    return i % size ? [] : this.slice(i, i + size);
                                }, str)
                            );
                        };
                        const titles = chunk(node.item.content.title, 28);
                        // title, needs to be added to getBBox()
                        const titleElement = ren
                            .label(titles[0], box.x, box.y + config.node.title.marginY)
                            .css({ fontSize: '12px', color: config.textColor, fontWeight: 'bold' }).attr({ zIndex: 1 })
                            .add();

                        if (titles.length > 1) {
                            // title = title.substr(0, 21);
                            const titleElement2 = ren
                                .label(titles[1], box.x, box.y + 13 + config.node.title.marginY)
                                .css({ fontSize: '12px', color: config.textColor, fontWeight: 'bold' }).attr({ zIndex: 1 })
                                .add();
                            // - center it
                            titleElement2.attr({ x: box.x + box.w / 2 - titleElement2.width / 2 });
                            elements.push(titleElement2);
                        }
                        // - center it
                        titleElement.attr({ x: box.x + box.w / 2 - titleElement.width / 2 });
                        elements.push(titleElement);

                        // rows
                        const rowsY = titleElement.height + config.node.title.marginY * 2;

                        for (let i = 0; i < node.item.content.data.length; i++) {
                            // legend box

                            elements.push(ren
                                .rect(
                                    box.x,
                                    box.y + rowsY + config.node.row.height * i,
                                    config.node.row.width,
                                    config.node.row.height)
                                .attr({
                                    fill: colors[i], zIndex: 1
                                }));

                            const text = (node.item.content.data[i]);
                            const color = text && text.includes('-') ? '#ED5565' : config.textColor;
                            const textElement = ren
                                .label(text,
                                    box.x + config.node.row.width,
                                    box.y + rowsY + config.node.row.height * i)
                                .css({ fontSize: '12px', color: color }).attr({ zIndex: 1 })
                                .add();
                            // - align right
                            textElement.attr({ x: box.x + box.w - textElement.width - config.node.row.marginX });
                            elements.push(textElement);
                        }

                        // calculate node height(if not set) based on rendered content
                        if (typeof (config.node.height) === 'undefined' || config.node.height === null || config.node.height < 1) {
                            config.node.height = box.h = rowsY + node.item.content.data.length * config.node.row.height;
                        }

                        // main box
                        elements.push(ren
                            .rect(box.x, box.y, box.w, box.h)
                            .attr({ fill: config.node.backgroundColor, zIndex: 0 }));

                        // draw line to parent
                        if (node.parent != null) {
                            elements.push(ren
                                .path(['M', box.x + box.w / 2, box.y, 'L', box.x + box.w / 2, box.y - config.node.marginY / 2 - config.connector.width / 2])
                                .attr({ 'stroke-width': config.connector.width, stroke: config.connector.color }));
                        }

                        node.children = _.sortBy(node.children, ['x']);
                        // draw line to children
                        if (node.children.length > 0) {
                            const nodeBottomMiddle = { x: box.x + box.w / 2, y: box.y + box.h };
                            elements.push(ren
                                .path(['M', nodeBottomMiddle.x, nodeBottomMiddle.y, 'L', nodeBottomMiddle.x, nodeBottomMiddle.y + config.node.marginY / 2])
                                .attr({ 'stroke-width': config.connector.width, stroke: config.connector.color }));

                            // draw line over children
                            if (node.children.length > 1) {
                                elements.push(ren
                                    .path([
                                        'M', node.getRightMostChild().x *
                                        (config.node.width + config.node.marginX) +
                                        config.node.width / 2 - config.connector.width / 2, nodeBottomMiddle.y + config.node.marginY / 2,
                                        'L', node.getLeftMostChild().x *
                                        (config.node.width + config.node.marginX) +
                                        config.node.width / 2 + config.connector.width / 2, nodeBottomMiddle.y + config.node.marginY / 2])
                                    .attr({ 'stroke-width': config.connector.width, stroke: config.connector.color }));
                            }
                        }

                        // tslint:disable-next-line:no-shadowed-variable
                        H['each'](node.children, function (node: any) {
                            drawNode(elements, node, colors);
                        });
                    };

                    const getTree = function (treeOrData: any) {
                        return treeOrData.root ? treeOrData : new Tree(treeOrData, ExtendTreeView.distance).build();
                    };

                    // clear the previous
                    H['each'](elements, function (element: any) { element.destroy(); }); elements = [];

                    if (data === null || typeof (data) === 'undefined' || typeof (data.tree) === 'undefined' || data.tree === null) { // error
                        elements.push(ren.label('Invalid data.', 0, 0).css({ fontSize: '14px', color: '#EE0000', fontWeight: 'bold' }));
                    } else {
                        const tree: any = getTree(data.tree || []), legends = data.legends || [];

                        // draw tree
                        tree.root.forEach((ro, index) => {

                            drawNode(elements, ro, colors);

                            if (ro.children.length > 0) {
                                let offsetX = 100;
                                for (let i = 0; i < Math.min(legends.length, ro.item.content.data.length); i++) {

                                    elements.push(ren
                                        .rect(offsetX + config.legend.marginX, maxY + config.legend.marginY, config.node.row.width, config.node.row.height)
                                        .attr({ fill: colors[i] }));

                                    offsetX += config.node.row.width + 5/*spacing between legend box and legend text*/;

                                    const legendTextElement = ren
                                        .label(legends[i].text,
                                            offsetX + config.legend.marginX,
                                            maxY + config.legend.marginY)
                                        .css({ fontSize: '13px', color: config.textColor, fontWeight: 'bold' })
                                        .attr({ zIndex: 1 })
                                        .attr({ title: legends[i].text })
                                        .attr({ name: legends[i].text })
                                        .add();
                                    elements.push(legendTextElement);

                                    offsetX += legendTextElement.width + 30/*spacing between legends */;
                                }
                            }
                        });
                    }

                    H['each'](elements, function (element: any) {
                        if (element.added) { return; }
                        element.add();
                    });

                    this._elements = elements;
                },

                drawPoints: H['seriesTypes'].column.prototype.drawPoints,

                drawDataLabels: function () { return; }
            });
    }
}
