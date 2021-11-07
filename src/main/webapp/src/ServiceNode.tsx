import {Component} from 'react';
import {XYPosition, Handle, Position} from 'react-flow-renderer'
import { v4 as uuidv4 } from 'uuid';

interface Props {
    id?: string,
    data?: object,
    type?: string,
    selected?: boolean,
    position?: XYPosition,
    sourcePosition?: string,
    targetPosition?: string
}

export default class ServiceNode extends Component<Props, any>  {

    private id?: string
    private data?: object
    private type?: string
    private selected?: boolean
    private position?: XYPosition
    private sourcePosition?: string
    private targetPosition?: string

    constructor(props) {
        super(props);

        this.id = this.props.id
        this.data = this.props.data
        this.type = this.props.type
        this.selected = this.props.selected
        this.position = this.props.position
        this.sourcePosition = this.props.sourcePosition
        this.targetPosition = this.props.targetPosition
    }

    render () {
        return (
            <div style={{background: "white", border: "1px solid #000", borderRadius: 5, padding: 10}}>
                {/* @ts-expect-error*/}
                <div>{this.data.label}</div>
                <Handle
                    type="source"
                    position={Position.Bottom}
                    id={uuidv4()}
                    style={{ top: "30%", backgroundColor: "transparent", border: 0 }}
                />
            </div>
        )
    }
}