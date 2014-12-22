define(function (require) {
    var expect = require('chai').expect;
    var testUtils = require('testUtils');
    var tauCharts = require('tauCharts');
    var tooltip = require('plugins/tooltip');
    var describeChart = testUtils.describeChart;
    var showTooltip = function (expect, chart) {
        var d = testUtils.Deferred();
        var datum = chart.getSVG().querySelectorAll('.i-role-datum')[0];
        testUtils.simulateEvent('mouseover', datum);
        setTimeout(function () {
            d.resolve(document.querySelectorAll('.graphical-report__tooltip'));
        }, 400);
        return d;
    };
    var hideTooltip = function (expect, chart) {
        var d = testUtils.Deferred();
        var datum = chart.getSVG().querySelectorAll('.i-role-datum')[0];
        testUtils.simulateEvent('mouseout', datum);
        setTimeout(function () {
            d.resolve(document.querySelectorAll('.graphical-report__tooltip__content'));
        }, 400);
        return d;
    };
    var chartType = ['scatterplot', 'line', 'bar', 'horizontalBar'];
    chartType.forEach(function (item) {
        describeChart(
            "tooltip for " + item,
            {
                type: item,
                x: 'x',
                y: 'y',
                color: 'color',
                plugins: [tooltip()]
            },
            [{
                x: 2,
                y: 2,
                color: 'yellow'

            }, {
                x: 4,
                y: 2,
                color: 'yellow'

            }, {
                x: 5,
                y: 2,
                color: 'yellow'

            }, {
                x: 2,
                y: 1,
                color: 'green'

            }, {
                x: 6,
                y: 1,
                color: 'green'

            }],
            function (context) {
                it("should work tooltip", function (done) {
                    this.timeout(5000);
                    showTooltip(expect, context.chart).then(function (content) {
                        var items = content[0].querySelectorAll('.graphical-report__tooltip__list__item');
                        expect(items[0].textContent).to.be.equal('x2');
                        expect(items[1].textContent).to.be.equal('y2');
                        expect(items[2].textContent).to.be.equal('coloryellow');
                    })
                        .then(function () {
                            return hideTooltip(expect, context.chart);
                        })
                        .then(function () {
                            var content = document.querySelectorAll('.graphical-report__tooltip__content');
                            expect(content.length).not.be.ok;
                            return showTooltip(expect, context.chart);
                        })
                        .then(function () {
                            var content = document.querySelectorAll('.graphical-report__tooltip__content');
                            expect(content.length).to.be.ok;
                            var excluder = document.querySelectorAll('.i-role-exclude')[0];
                            testUtils.simulateEvent('click', excluder);
                            var d = testUtils.Deferred();
                            setTimeout(function () {
                                content = document.querySelectorAll('.graphical-report__tooltip__content');
                                expect(content.length).not.be.ok;
                                var data = context.chart.getData();
                                var expected = tauCharts.api._.sortBy(data,function (a) {
                                    return a.x;
                                });
                                expect(expected).to.be.eql(
                                    [{
                                        x: 2,
                                        y: 1,
                                        color: 'green'

                                    }, {
                                        x: 4,
                                        y: 2,
                                        color: 'yellow'

                                    }, {
                                        x: 5,
                                        y: 2,
                                        color: 'yellow'

                                    }, {
                                        x: 6,
                                        y: 1,
                                        color: 'green'

                                    }]
                                );
                                d.resolve();
                            }, 400);
                            return d;
                        }).then(function () {
                            return showTooltip(expect, context.chart);
                        }).then(function () {
                            var content = document.querySelectorAll('.graphical-report__tooltip__content');
                            expect(content.length).to.be.ok;
                            context.chart.destroy();
                            content = document.querySelectorAll('.graphical-report__tooltip__content');
                            expect(content.length).not.be.ok;
                            done();
                        });
                });
            },
            {
                autoWidth: true
            }
        );
    });
});