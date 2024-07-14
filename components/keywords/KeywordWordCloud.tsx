import React, { useEffect, useRef } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4plugins_wordCloud from "@amcharts/amcharts4/plugins/wordCloud";
import { Keyword } from "@/types";

const KeywordCloud: React.FC<{ keywords: Keyword[] }> = ({ keywords }) => {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const chart = am4core.create(chartRef.current, am4plugins_wordCloud.WordCloud);
        chart.fontFamily = "Courier New";

        chart.data = keywords.map(keyword => ({
            tag: keyword.word,
            count: keyword.count
        }));

        const series = chart.series.push(new am4plugins_wordCloud.WordCloudSeries());
        series.dataFields.word = "tag";
        series.dataFields.value = "count";
        series.accuracy = 4;
        series.rotationThreshold = 0.5;
        series.maxFontSize = am4core.percent(30);

        chart.seriesContainer.background.fill = am4core.color("#f2f2f2");
        chart.seriesContainer.background.fillOpacity = 0.5;

        return () => {
            chart.dispose();
        };
    }, [keywords]);

    return <div ref={chartRef} style={{ width: '100%', height: '500px' }} />;
};

export default KeywordCloud;
