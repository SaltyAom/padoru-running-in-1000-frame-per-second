import React, { Component, Fragment } from "react"
import ReactDOM from "react-dom"

import "./main.css"

let frame = [
    "frame/padoru0.png",
    "frame/padoru1.png",
    "frame/padoru2.png",
    "frame/padoru3.png",
    "frame/padoru0.png" // Fallback
]

class Root extends Component {
    constructor(props){
        super(props);
        this.state = {
            top: 30,
            left: -20,
            sprite: 0,
            initTop: 30,
            unit: undefined,
            extraSpeed: 0,
            outside: 1,
            outsideY: 0
        }
    }

    componentDidMount(){
        if(window.innerHeight > window.innerWidth){
            // Portrait
            this.setState({
                unit: "vw"
            })
        } else {
            this.setState({
                unit: "vh"
            })
        }

        window.addEventListener("resize", () => {
            if(window.innerHeight > window.innerWidth){
                // Portrait
                this.setState({
                    unit: "vw"
                })
            } else {
                this.setState({
                    unit: "vh"
                })
            }
        })
        
        document.getElementById("audio").pause();

        window.addEventListener('load', () => {
            document.getElementById("audio").play();
            this.setState({
                load: true
            })
            this.animate();
            setInterval(() => {
                this.animate();
            },11625)
        })
    }

    animate(){
        this.setState({
            top: 30,
            left: -20,
            sprite: 0,
            initTop: 30,
            extraSpeed: 0,
            outside: 1,
            outsideY: 0
        })

        document.getElementById("audio").currentTime = 0

        setTimeout(() => {
            let outsideYInterval = setInterval(() => {
                this.setState({
                    outsideY: this.state.outsideY - 0.0075
                })
                setTimeout(() => {
                    clearInterval(outsideYInterval);
                    return;
                }, 3500)
            }, 1)
        }, 100)

        setTimeout(() => {
            let fadeInterval = setInterval(() => {
                this.setState({
                    outside: this.state.outside - 0.0025
                })
                if(this.state.outside <= 0){
                    this.setState({
                        outside: 0
                    })
                    clearInterval(fadeInterval);
                    return;
                }
            }, 1);
        }, 3000)

        setTimeout(() => {
            this.goRight();
        },3500)

        let spin = 0;

        setTimeout(() => {
            let spinInterval = setInterval(() => {
                spin++;
                this.setState({
                    sprite: this.state.sprite + 1
                })
                if(this.state.sprite > 3) this.setState({
                    sprite: 0
                })
                if(spin >= 16){
                    clearInterval(spinInterval);
                    setTimeout(() => {
                        this.setState({
                            extraSpeed: 0.065
                        })
                    }, 0);
                    return;
                }
            },150)
        }, 6000)

        let jump = 0

        setTimeout(() => {
            let jumpInterval = setInterval(() => {
                this.jump();
                jump++;
                if(jump >= 6){
                    clearInterval(jumpInterval);
                    return;
                }
            },340);
        },8000)
    }

    playAudio(){
        document.getElementById('audio').play();
    }

    goRight(){
        let right = setInterval(() => {
            this.setState({
                left: this.state.left + 0.055 + this.state.extraSpeed
            })
            if(this.state.left > 120){
                clearInterval(right);
            }
        },1)
    }

    async jump(){
        let initJump = this.state.initTop,
            jump = initJump,
            initFall = 0,
            limit = 10

        let beforeCenter = new Promise((resolve) => {
            let firstHalf = setInterval(() => {
                jump = jump - (jump/ (limit * 5));
                this.setState({
                    top: jump
                })
                if(this.state.top < initJump - limit){
                    clearInterval(firstHalf);
                    return resolve();
                }
            })
        })

        await beforeCenter;

        let afterCenter = new Promise((resolve) => {
            let secondHalf = setInterval(() => {
                initFall += (0.005 + (initFall * 0.005));
                this.setState({
                    top: this.state.top + initFall
                })
                if(this.state.top > initJump){
                    this.setState({
                        top: this.state.initJump
                    })
                    clearInterval(secondHalf);
                    return resolve();
                }
            })
        })

        await afterCenter;

        this.setState({
            top: this.state.initTop
        })
        return;
    }

    render(){
        if(this.state.load){
            return(
                <Fragment>
                    <div 
                        id="outside" 
                        style={{opacity: this.state.outside, backgroundPositionY: `${this.state.outsideY}vh`}}
                        onClick={() => this.playAudio()}
                    ></div>
                    <div id="hall" onClick={() => this.playAudio()}></div>
                    <img 
                        id="frame" src={frame[this.state.sprite]} 
                        alt="Padoru" 
                        onClick={() => this.playAudio()}
                        style={{
                            top: `${this.state.top}${this.state.unit}`,
                            left: `${this.state.left}%`
                        }}
                    />
                </Fragment>
            )
        } else {
            return (
                <div id="loading">
                    Loading
                </div>
            )
        }
    }
}

ReactDOM.render(<Root />, document.getElementById("root"));