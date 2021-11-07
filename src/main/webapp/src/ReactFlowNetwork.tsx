import {Component} from 'react';
import ReactFlow, {Background} from 'react-flow-renderer';
import SockJsClient from 'react-stomp';
import { v4 as uuidv4 } from 'uuid';
import NetworkLink from './NetworkLink';
import Ping from './Ping';
import ServiceNode from './ServiceNode';

const SOCKET_URL = 'http://localhost:8100/ws-message';

interface States {
    elements: any[],
    networkEdges: any[],
    reactFlowInstance: any
}

export default class ReactFlowNetwork extends Component<any, States> {

    constructor(props) {
        super(props)

        this.state = {
            elements: [],
            networkEdges: [],
            reactFlowInstance: null
        }

        this.refreshElements = this.refreshElements.bind(this)
        this.onLoadReactFlow = this.onLoadReactFlow.bind(this)
    }

    onConnected () {
        console.log("Connected!!")
    }

    refreshElements() {
        let el = this.state.elements;
        this.setState({elements: [...el]});
        this.state.reactFlowInstance.fitView()
    }

    doesNodeExist(node) : boolean {
        let networkEdges = this.state.networkEdges;
        if (networkEdges.length === 0) {
            return false;
        }
        if (networkEdges.find((edge) => edge.from === node) !== undefined) {
            return true;
        }
        if (networkEdges.find((edge) => edge.to === node) !== undefined) {
            return true;
        }
        return false;
    }

    doesEdgeExist(from, to) : boolean {
        let networkEdges = this.state.networkEdges;
        if (networkEdges.find((edge) => edge.from === from && edge.to === to) !== undefined) {
            return true;
        }
        return false;
    }

    animateEdge(edgeId, status) {
        let elements = this.state.elements;
        let edge = elements.find((e) => e.id === edgeId)
        if (edge !== undefined) {
            edge.animateWithStatusAndStopAfter(status, 1000);
            this.refreshElements();
        }
    }

    getEdgeId(from, to) : string {
        let networkEdges = this.state.networkEdges;
        let edge = networkEdges.find((edge) => edge.from === from && edge.to === to);
        if (edge !== undefined) {
            return edge.id;
        }
        return "-1";
    }

    getNodeIdByName(nodeName) {
        let networkEdges = this.state.networkEdges;

        let edge = networkEdges.find((edge) => edge.from === nodeName); // search from first
        if (edge !== undefined) {
            return edge.fromId;
        }

        edge = networkEdges.find((edge) => edge.to === nodeName);  // then search to
        if (edge !== undefined) {
            return edge.toId;
        }

        return "-1";
    }
  
    onMessageReceived (msg: Ping) { 
        let newServiceNodeFrom = null;
        let newServiceNodeTo = null;

        let fromNodeName = msg.srcServiceName == null ? 'www' : msg.srcServiceName;
        let toNodeName = msg.destServiceName;

        let nodeFromUpdated = false;
        let nodeToUpdated = false;
        let edgesUpdated = false;

        if (!this.doesNodeExist(fromNodeName)) {
            newServiceNodeFrom = new ServiceNode({
                id: uuidv4(),
                type: 'special',
                data: { label: fromNodeName },
                position: { x: Math.random()*600, y: Math.random()*400 }
            })
            nodeFromUpdated = true;
        }

        if (!this.doesNodeExist(toNodeName)) {
            newServiceNodeTo = new ServiceNode({
                id: uuidv4(),
                type: 'special',
                data: { label: toNodeName },
                position: { x: Math.random()*600, y: Math.random()*400 }
            })
            nodeToUpdated = true;
        }

        let newNetworkLink = null;
        if (this.doesEdgeExist(fromNodeName, toNodeName)) {
            let existingEdgeId = this.getEdgeId(fromNodeName, toNodeName);
            this.animateEdge(existingEdgeId, msg.responseStatus);
        }
        else {
            newNetworkLink = new NetworkLink({
                id: uuidv4(),
                source: newServiceNodeFrom != null ? newServiceNodeFrom.props.id : this.getNodeIdByName(fromNodeName),
                target: newServiceNodeTo != null ? newServiceNodeTo.props.id : this.getNodeIdByName(toNodeName),
                type: 'special',
                animated: true,
                style: {stroke: Ping.colorFromStatus(msg.responseStatus), strokeWidth: 2},
                refreshElements: this.refreshElements
            })
            edgesUpdated = true;
        }
       
        let newEdge = null;
        if (edgesUpdated) {
            newEdge = {
                id: newNetworkLink.props.id,
                from: fromNodeName,
                to: toNodeName,
                fromId: newNetworkLink.props.source,
                toId: newNetworkLink.props.target
            }
        }

        if (nodeFromUpdated && nodeToUpdated) { // both from & to = new
            this.setState({elements: [...this.state.elements, newServiceNodeFrom, newServiceNodeTo, newNetworkLink], 
                networkEdges: [...this.state.networkEdges, newEdge]}, 
                () => this.state.reactFlowInstance.fitView());
        }
        if (nodeFromUpdated && !nodeToUpdated) { // only from = new
            this.setState({elements: [...this.state.elements, newServiceNodeFrom, newNetworkLink], 
                networkEdges: [...this.state.networkEdges, newEdge]}, 
                () => this.state.reactFlowInstance.fitView());
        }
        if (!nodeFromUpdated && nodeToUpdated) { // only to = new
            this.setState({elements: [...this.state.elements, newServiceNodeTo, newNetworkLink], 
                networkEdges: [...this.state.networkEdges, newEdge]}, 
                () => this.state.reactFlowInstance.fitView());
        }

        if (!nodeFromUpdated && !nodeToUpdated && edgesUpdated) { // both from & to = existing, but a new edge is needed
            this.setState({elements: [...this.state.elements, newNetworkLink], 
                networkEdges: [...this.state.networkEdges, newEdge]}, 
                () => this.state.reactFlowInstance.fitView());
        }
    }

    onLoadReactFlow(_reactFlowInstance) {
        this.setState({reactFlowInstance: _reactFlowInstance});
        _reactFlowInstance.fitView();
    }

    onDisconnect () {
        console.log("Disconnected!")
    }

    render() {
        return (
            <ReactFlow 
            onLoad={this.onLoadReactFlow}
            snapToGrid={true}
            snapGrid={[15, 15]}
            elements={this.state.elements}
            nodeTypes={{special: ServiceNode}}
            edgeTypes={{special: NetworkLink}}>
                <SockJsClient
                    url={SOCKET_URL}
                    topics={['/topic/ping']}
                    onConnect={this.onConnected}
                    onDisconnect={this.onDisconnect}
                    onMessage={(msg: any) => this.onMessageReceived(msg)}
                    debug={false}
                />
                <Background color="#aaa" gap={16} />
            </ReactFlow>
        )
    }
};