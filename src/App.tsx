import React, { useState } from 'react'
import { useSprings, animated, to as interpolate } from '@react-spring/web'
import { useDrag } from 'react-use-gesture'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import styles from './styles.module.css'
import { Swiper, SwiperClass, SwiperRef, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/scss'
import 'swiper/scss/navigation'
import 'swiper/scss/pagination'

const bull = (
  <Box component="span" sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}>
    •
  </Box>
)
const cards = [
  'https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_06_Lovers.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/RWS_Tarot_02_High_Priestess.jpg/690px-RWS_Tarot_02_High_Priestess.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg',
]

const card = (
  <React.Fragment>
    <CardContent>
      <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
        Word of the Day
      </Typography>
      <Typography variant="h5" component="div">
        be{bull}nev{bull}o{bull}lent
      </Typography>
      <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>adjective</Typography>
      <Typography variant="body2">
        well meaning and kindly.
        <br />
        {'"a benevolent smile"'}
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small">Learn More</Button>
    </CardActions>
  </React.Fragment>
)

const to = i => ({
  x: 0,
  y: i * 3,
  scale: 1,
  rot: -5 + Math.random() * 10,
  delay: i * 100,
})
const from = _i => ({ x: 0, rot: 0, scale: 1.5, y: -1000 })
const trans = (r, s) => `perspective(1500px) rotateX(0deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`

function Deck() {
  const [gone] = useState(() => new Set())
  const [cardIndex, setCardIndex] = useState(() => new Set())
  const [idx, setIdx] = useState(cards.length - 1)
  const [state, setState] = useState(new Set())

  const addFoo = foo => {
    setState(previousState => new Set([...previousState, foo]))
  }

  const [props, api] = useSprings(cards.length, i => ({
    ...to(i),
    from: from(i),
  }))

  const swipeCard = (index, direction) => {
    gone.add(idx)
    console.log(index, gone)
    if (idx > 0) {
      setIdx(idx - 1)
    } else {
      setIdx(cards.length - 1)
    }

    api.start(i => {
      if (idx !== i) return
      const isGone = gone.has(index)
      const x = isGone ? (200 + window.innerWidth) * direction : 1 ? 1 : 0
      const rot = 2 / 100 + (isGone ? direction * 10 * 20 : 0)
      const scale = 1 ? 1.1 : 1
      return {
        x,
        rot,
        scale,
        delay: undefined,
        config: { friction: 50, tension: 100 },
      }
    })

    if (gone.size === cards.length) {
      setTimeout(() => {
        gone.clear()
        api.start(i => to(i))
      }, 600)
    }
  }

  return (
    <>
      {props.map(({ x, y, rot, scale }, i) => (
        <div key={i}>
          <animated.div className={styles.deck} style={{ x, y }}>
            <animated.div
              style={{
                transform: interpolate([rot, scale], trans),
              }}>
              <Swiper
                className="mySwiper2 swiper-h"
                spaceBetween={50}
                loop={true}
                pagination={{
                  clickable: true,
                }}
                modules={[Pagination, Navigation]}>
                <SwiperSlide key={'0'} className={'swiper-slided-nested'}>
                  <Card variant="outlined">{card}</Card>
                </SwiperSlide>
                <SwiperSlide key={'0'} className={'swiper-slided-nested'}>
                  <Card variant="outlined">{card}</Card>
                </SwiperSlide>
                <SwiperSlide key={'0'} className={'swiper-slided-nested'}>
                  <Card variant="outlined">{card}</Card>
                </SwiperSlide>
              </Swiper>
            </animated.div>
          </animated.div>
          <div className={styles.controls}>
            <Button
              variant="outlined"
              onClick={() => swipeCard(i, -1)}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white">
              <ChevronLeft className="h-4 w-4" />
              Swipe Left
            </Button>
            <Button
              variant="outlined"
              onClick={() => swipeCard(i, 1)}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white">
              Swipe Right
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </>
  )
}

export default function App() {
  return (
    <div className={styles.container}>
      <Deck />
    </div>
  )
}
