import React, { Component } from 'react';
import DeckGL from '@deck.gl/react';
import {StaticMap} from 'react-map-gl';
import GL from '@luma.gl/constants';
import {connect} from 'react-redux';

import {fetchFlightData} from './actions/website';
import ArcBrushingLayer from './ArcBrushingLayer';
import styled from 'styled-components';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZnJlZW1hbmRpZ2l0YWwiLCJhIjoiY2p3YzBrZGV0MDdvOTQ5bndxemZiem5jNCJ9.4IX0pKB94mSmkrwLSJOwfQ';

const INITIAL_VIEW_STATE = {
    longitude: -1.4157267858730052,
    latitude: 52.232395363869415,
    zoom: 1.5,
    minZoom: 1,
    maxZoom: 15,
    pitch: 40.5,
    bearing: -30.396674584323023
};

class App extends Component {

    constructor() {
        super();
        this.state = {
            time: 0.001,
            data: []    
        }
    }   

    componentWillMount(){
        this.props.fetchFlightData();
    }

    componentDidMount() {
        setTimeout(()=>{
            requestAnimationFrame(this.animate.bind(this));
        },1000);
    }

    animate() {
        let time = this.state.time += 0.003;
        this.setState({time})
        requestAnimationFrame(this.animate.bind(this));
    }
   
    render() {
        
        const layer = new ArcBrushingLayer({
            id: 'arc-layer',
            data: this.props.flightData,
            getWidth: .8,
            getSourcePosition: d => d.from.coordinates,
            getTargetPosition: d => d.to.coordinates,
            getTargetColor: d => [255,80,Math.floor(Math.random() * 255) + 0],
            coef:this.state.time
        });

        return (
            <div data-test="component-app">
                <Panel>
                    <h2>Flight Paths</h2>
                    <p>Data visualisation showing International flight paths.</p>
                    <p>Hold <em>SHIFT + DRAG</em> to rotate angle.</p>
                </Panel>
                
                <DeckGL 
                    controller={true} 
                    layers={[layer]} 
                    initialViewState={INITIAL_VIEW_STATE}
                    parameters={{
                        blendFunc: [GL.SRC_ALPHA, GL.ONE, GL.ONE_MINUS_DST_ALPHA, GL.ONE],
                        blendEquation: GL.FUNC_ADD
                    }}>

                    <StaticMap 
                        mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} 
                        mapStyle="mapbox://styles/freemandigital/cjwcje61100uu1cmvtorou38d?fresh=true"
                    /> 
                           
                </DeckGL>
            </div>
        );
    }  
}

function mapStateToProps(state){
	return { 
		flightData: state.website.flightData
	}
}

export default connect(mapStateToProps, { fetchFlightData })(App);


const Panel = styled.div`
    position:absolute;
    top:0;
    right:0;
    padding:20px 40px;
    background:#000;
    z-index:99;
    min-width:300px;

    h2 {
        color:#fff;
        font-weight:normal;
        margin:0;
        font-size:18px;
        margin-bottom:4px;
    }

    em {
        color: #ffcd03;
    }

    p {
        color:#fff;
        font-weight:normal;
        margin:0;
        font-size:12px;
        opacity:.8;
    }
`