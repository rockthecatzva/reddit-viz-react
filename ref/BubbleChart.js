import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { scaleVal, findRange, getMonthName } from '../DrawingUtils'
import ToolTip from './ToolTip'

//const d3 = require('d3');

export default class BubbleChart extends Component {

    render() {
        const { width, height, bubbleData, labels, clickHandler, selectedBubble } = this.props;

        const marginSide = 10,
            marginCaps = 50,
            maxCircleSize = 18,
            minCircleSize = 4,
            vertSpaceMultiplier = 80,
            timeRange = findRange(bubbleData, "date"),
            voteRange = findRange(bubbleData, "score"),
            //curry functions
            timeScaler = scaleVal(width, 0, timeRange),
            sizeScaler = scaleVal(maxCircleSize, minCircleSize, voteRange),
            yPos = (val) => (labels.indexOf(val) * vertSpaceMultiplier) + marginCaps / 2,
            axisTickCount = 4,
            axisTicks = new Array(axisTickCount).fill(undefined).map((v, i) => {
                    const xpos = timeScaler((((i+1) / (axisTickCount+1)) * (timeRange[1] - timeRange[0])) + timeRange[0]  )
                    return <line className="tick-mark" x1={xpos} y1={0} x2={xpos} y2={10} />
            }),
            axisTickText = new Array(axisTickCount).fill(undefined).map((v, i) => {
                const tickTime = (((i+1) / (axisTickCount+1)) * (timeRange[1] - timeRange[0])) + timeRange[0] 
                const xpos = timeScaler(tickTime);
                const renderTime = ((new Date(timeRange[1]).getTime()-new Date(timeRange[0]).getTime())/(24*60*60*1000)) < 1 ?
                    new Date(tickTime).toLocaleString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' }):
                    new Date(tickTime).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                
                return <text className="tick-text" x={xpos} y={18} >{renderTime}</text>
        })


        const renderLabels = labels.map((l, i) => <foreignObject x={0} y={yPos(l)} key={i}><div className='subreddit-label'>/{l}</div></foreignObject>)
        const circles = bubbleData.map((d, i) => <circle cx={timeScaler(d.date)} cy={yPos(d.sub)} r={sizeScaler(d.score)} className={d.title === selectedBubble ? "bubble-selected" : "bubble"} onClick={() => { clickHandler(d) }} key={i} />)
        const toolTip = selectedBubble !== "" ? [bubbleData.filter(d => d.title === selectedBubble).map(d => <foreignObject x={timeScaler(d.date)} y={yPos(d.sub)} ><ToolTip {...d} /></foreignObject>)] : [];
        const axes = labels.map((l, i) => <line className="axis-line" x1={0} y1={yPos(l)} x2={width} y2={yPos(l)} />)

        return (
            <svg width={width} height={height}>
                {renderLabels}
                {circles}
                {toolTip}
                {axes}
                {axisTicks}
                {axisTickText}
            </svg>
        )
    }
}

BubbleChart.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    bubbleData: PropTypes.array.isRequired,
    labels: PropTypes.array.isRequired,
    clickHandler: PropTypes.func.isRequired,
    selectedBubble: PropTypes.string.isRequired
}