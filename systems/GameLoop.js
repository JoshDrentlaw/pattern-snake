import React from 'react'
import {Dimensions} from 'react-native'

import {SIZE} from '../entities/Head'
import Tail, {tailSpacer} from '../entities/Tail'
import Pellet from '../entities/Pellet'

export default function (entities, {touches, dispatch}) {
    const head = entities.head,
        patternDisplay = entities.patternDisplay,
        top = 50,
        bottom = Math.floor(Dimensions.get('window').height - 125),
        left = 0,
        right = Math.floor(Dimensions.get('window').width),
        colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple']
    let tail = [],
        pellets = []

    // store tail pieces
    for (let e in entities) {
        if (entities[e].name === 'tail') {
            tail.push(entities[e])
        }
    }

    // store pellets
    for (let e in entities) {
        if (entities[e].name === 'pellet') {
            pellets.push({...entities[e], id: e})
        }
    }

    // drop more pellets
    if (pellets.length === 0) {
        --head.pelletDrop
        if (head.pelletDrop === 0) {
            head.pelletDrop = head.pelletDropFreq
            patternDisplay.pattern = []
            patternDisplay.eaten = []

            for (let i = 0; i < 4; i++) {
                let color
                do {
                    color = randomColor()
                } while (patternDisplay.pattern.includes(color))
                patternDisplay.pattern.push(color)
            }
            patternDisplay.pattern.forEach((p, i) => {
                entities[`pellet${i}`] = {
                    name: 'pellet',
                    color: p,
                    position: randomLocation(),
                    renderer: <Pellet />,
                }
            })
        }
    } else {
        // eat pellet
        pellets = pellets.filter(p => {
            if (
                head.position[0] + SIZE >= p.position[0] &&
                head.position[0] < p.position[0] + SIZE &&
                head.position[1] + SIZE >= p.position[1] &&
                head.position[1] < p.position[1] + SIZE
            ) {
                patternDisplay.eaten.push(p.color)
                const patternComparer = patternDisplay.pattern.slice(0, patternDisplay.eaten.length)

                if (patternDisplay.eaten.filter((e, i) => e !== patternComparer[i]).length > 0) {
                    dispatch({msg: 'game-over', score: patternDisplay.score})
                } else {
                    patternDisplay.score++
                    delete entities[p.id]
                    const lastTail = tail[tail.length - 1].position,
                        x = ['up', 'left'].includes(lastTail.direction) ? lastTail[0] - SIZE * 2 : lastTail[0],
                        y = ['down', 'right'].includes(lastTail.direction) ? lastTail[1] - SIZE * 2 : lastTail[1]
                    tail.push({
                        name: 'tail',
                        position: [x, y],
                        color: '#666',
                        renderer: <Tail />,
                    })
                }
            } else {
                return p
            }
        })

        if (pellets.length === 0) {
            patternDisplay.score += 5
        }
    }

    // change direction with touch
    if (touches.length > 0) {
        // filter to just move touches and get deltas
        touches
            .filter(t => t.type === 'move')
            .forEach(({delta: {pageX, pageY}}) => {
                // get absolute value of x and y
                const x = Math.abs(pageX),
                    y = Math.abs(pageY),
                    xTolerance = Math.abs(x - y) >= 10,
                    yTolerance = Math.abs(y - x) >= 10

                // whichever one is greater will determine which direction your swiping MOST
                // there will always be a bit of x and y registered on each swipe unless your perfect with your swipe
                if (xTolerance && x > y) {
                    // left or right
                    if (pageX > 0) {
                        // right
                        head.direction = 'right'
                    } else {
                        head.direction = 'left'
                    }
                } else if (yTolerance && x < y) {
                    // up or down
                    if (pageY > 0) {
                        //down
                        head.direction = 'down'
                    } else {
                        head.direction = 'up'
                    }
                }
            })
    }

    // update movement ever X frame
    head.update -= 1
    if (head.update === 0) {
        let tailLength = tail.length - 1
        // snake moves by each piece taking the place of the piece before it, while the
        // head moves on its own and turns from user input
        let pos = [[head.position[0], head.position[1]], ...tail.slice(0, -1).map(t => t.position)]

        // move the head to a new position and
        // change direction if necessary
        directionSwitch(head.direction, head)

        // check if the head hit a wall
        if (
            head.position[0] < left ||
            head.position[0] >= right ||
            head.position[1] < top ||
            head.position[1] >= bottom
        ) {
            dispatch({msg: 'game-over', score: patternDisplay.score})
        }

        // check if head hit the tail
        tail.forEach(t => {
            if (t.position[0] === head.position[0] && t.position[1] === head.position[1]) {
                dispatch({msg: 'game-over', score: patternDisplay.score})
            }
        })

        let lastTail = tail[tailLength],
            oldPos
        // update tail postiion based on pos array and
        // update entities array
        tail = tail.map((t, i) => {
            if (i === tailLength) {
                oldPos = t.position
            }
            t.position = [pos[i][0], pos[i][1]]
            entities[`tail${i}`] = t
            return t
        })
        lastTail.direction = getLastTailDirection(oldPos, lastTail)
        // reset update counter
        head.update = head.updateFreq
    } else {
        // update entities array
        tail = tail.map((t, i) => {
            entities[`tail${i}`] = t
            return t
        })
    }

    function upLeft(e, idx) {
        e.position[idx] -= e.velocity
    }

    function downRight(e, idx) {
        e.position[idx] += e.velocity
    }

    function directionSwitch(dir, e) {
        switch (dir) {
            case 'up':
                upLeft(e, 1)
                break
            case 'down':
                downRight(e, 1)
                break
            case 'left':
                upLeft(e, 0)
                break
            case 'right':
                downRight(e, 0)
                break
            default:
                downRight(e, 0)
        }
    }

    function randomLocation() {
        return [
            Math.round((Math.floor(Math.random() * (right - 75)) + 75) / SIZE) * SIZE,
            Math.round((Math.floor(Math.random() * (bottom - 75)) + 75) / SIZE) * SIZE,
        ]
    }

    function randomColor() {
        return colors[Math.floor(Math.random() * colors.length)]
    }

    function getLastTailDirection(oldPos, tailPiece) {
        const deltaX = oldPos[0] + tailPiece[0],
            deltaY = oldPos[1] + tailPiece[1]

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // left or right
            if (deltaX > 0) {
                // right
                return 'right'
            } else {
                return 'left'
            }
        } else {
            // up or down
            if (deltaY > 0) {
                //down
                return 'down'
            } else {
                return 'up'
            }
        }
    }

    return entities
}
