import {Component, CSSProperties} from 'react';
import {getBezierPath, getMarkerEnd, ArrowHeadType, Position} from 'react-flow-renderer'
import Ping from './Ping';

interface Props {
    id?: string,
    source?: string,
    target?: string,
    //selected?: boolean,
    animated?: boolean,
    /*label?: string,
    labelStyle?: string,
    labelShowBg?: boolean,
    labelBgStyle?: string,
    labelBgPadding?: number,
    labelBgBorderRadius?: number,*/
    data?: object,
    style?: CSSProperties,
    arrowHeadType?: ArrowHeadType,
    sourceX?: number,
    sourceY?: number,
    targetX?: number,
    targetY?: number,
    sourcePosition?: Position,
    targetPosition?: Position,
    markerEndId?: string,

    refreshElements?: any
}

export default class NetworkLink extends Component<Props, any>  {

    private id?: string
    private source?: string
    private target?: string
    //private selected?: boolean
    private animated?: boolean
    /*private label?: string
    private labelStyle?: string
    private labelShowBg?: boolean
    private labelBgStyle?: string
    private labelBgPadding?: number
    private labelBgBorderRadius?: number*/
    private data?: object
    private style?: CSSProperties
    private arrowHeadType?: ArrowHeadType
    private sourceX?: number
    private sourceY?: number
    private targetX?: number
    private targetY?: number
    private sourcePosition?: Position
    private targetPosition?: Position
    private markerEndId?: string
    private edgePath?: string
    private markerEnd?: string

    private refreshElements: any

    constructor(props) {
        super(props);

        this.id = this.props.id
        this.source = this.props.source
        this.target  = this.props.target
        //this.selected  = this.props.selected
        this.animated  = this.props.animated 
        /*this.label  = this.props.label
        this.labelStyle = this.props.labelStyle
        this.labelShowBg = this.props.labelShowBg
        this.labelBgStyle = this.props.labelBgStyle
        this.labelBgPadding = this.props.labelBgPadding 
        this.labelBgBorderRadius = this.props.labelBgBorderRadius*/
        this.data = this.props.data 
        this.style = this.props.style
        this.arrowHeadType = this.props.arrowHeadType
        this.sourceX = this.props.sourceX
        this.sourceY = this.props.sourceY
        this.targetX = this.props.targetX
        this.targetY = this.props.targetY
        this.sourcePosition = this.props.sourcePosition
        this.targetPosition = this.props.targetPosition
        this.markerEndId = this.props.markerEndId

        this.refreshElements = this.props.refreshElements

        const bezierParams = {
            sourceX: this.sourceX, 
            sourceY: this.sourceY, 
            sourcePosition: this.sourcePosition, 
            targetX: this.targetX, 
            targetY: this.targetY, 
            targetPosition: this.targetPosition
        }
        this.edgePath = getBezierPath(bezierParams);
        this.markerEnd = getMarkerEnd(this.arrowHeadType, this.markerEndId);

        this.animateWithStatusAndStopAfter = this.animateWithStatusAndStopAfter.bind(this)
        this.stopAnimationAfter(1000);
    }

    animateWithStatusAndStopAfter(status, milli) {
        this.animated = true;
        this.style = {stroke: Ping.colorFromStatus(status), strokeWidth: 2}
        this.stopAnimationAfter(milli);
    }

    stopAnimationAfter(milli) {
        setTimeout(() => {
            this.animated = false;
            this.style = { strokeDasharray: 5, strokeDashoffset: 5, stroke: "grey", strokeWidth: 2}
            this.refreshElements();
        }, milli);
    }

    render () {
        return (
            <>
                <path id={this.id} style={this.style} className="react-flow__edge-path" d={this.edgePath} markerEnd={this.markerEnd} />
                <text>
                    <textPath href={`#${this.id}`} style={{ fontSize: '12px' }} startOffset="50%" textAnchor="middle">
                        {/* @ts-expect-error */}
                        {this.data.text}
                    </textPath>
                </text>
            </>
        )
    }
}