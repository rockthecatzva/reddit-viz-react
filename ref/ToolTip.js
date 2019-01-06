import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {getMonthName} from '../DrawingUtils'

export default class ToolTip extends Component {

    render() {
        const { title, link, score, date, ups, downs, domain, image, comments } = this.props;

        const d = new Date(date);
        const formatedDate = getMonthName(d.getMonth())
            + " " + d.getDate() 
            + ", " + d.getFullYear();
        const renderScore = Math.round(score/1000) + "k";


        return (
            <div className="tool-tip">
                <h4>{title}</h4>
                <h6>{formatedDate}</h6>
                <h6>{renderScore}</h6>
                <h6>{domain}</h6>
            </div>
        )
    }
}

ToolTip.propTypes = {
    title: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
    date: PropTypes.number.isRequired,
    ups: PropTypes.number.isRequired,
    downs: PropTypes.number.isRequired,
    domain: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    comments: PropTypes.number.isRequired,
}