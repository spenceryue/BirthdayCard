import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { animated, useSpring } from 'react-spring';
import * as d3 from 'd3';
import './styles.css';

const useClock = () => {
  const [{ clock }, set] = useSpring(() => ({
    clock: 0,
    immediate: true,
  }));
  useEffect(() => {
    const loop = () => {
      set({ clock: clock.value + 1 });
      id = requestAnimationFrame(loop);
    };
    let id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  });
  return clock;
};

const PI = Math.PI;
const _2PI = 2 * PI;
const cos = Math.cos;
const sin = Math.sin;
const degrees = i => ((i % 60) / 60) * 360;
const radians = i => ((i % 60) / 60) * _2PI;

const Trace = props => {
  const {
    R = 50,
    strokeWidth: s = 1,
    periods: f = 10,
    exaggerate: A = 0.1,
    numPoints: N = Math.max(10, 10 * f),
    transform = '',
    ...rest
  } = props;
  const points = [...Array(N)].map((_, i) => [
    (_2PI * i) / N,
    R * (1 - A / 2) +
      (R / 2) * A * sin(((_2PI * i) / N) * f) -
      s / 2,
  ]);
  const line = d3
    .lineRadial()
    .curve(d3.curveCatmullRomClosed.alpha(0.5));
  return (
    <g
      transform={
        'translate(50,50) ' +
        transform +
        ' translate(-50,-50)'
      }
    >
      <path
        d={line(points)}
        fill="transparent"
        stroke="gray"
        strokeWidth={s}
        transform="translate(50 50)"
        {...rest}
      />
    </g>
  );
};

const Flower = ({
  N = 5,
  clock,
  frequency = 0.33,
  ...rest
}) => (
  // <rect
  //   x={0}
  //   width={100}
  //   height={100}
  //   fill="transparent"
  //   stroke="red"
  // />
  <svg
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidyMid meet"
    {...rest}
  >
    <animated.g
      transform={
        clock
          ? clock.interpolate(
              i => `rotate(${degrees(i * frequency)} 50 50)`
            )
          : ''
      }
    >
      {[...Array(N)].map((_, i) => {
        const a = Math.random();
        const b = Math.random();
        const c = Math.random();
        return (
          <>
            <Trace
              stroke={`hsla(${330 -
                i * 720 * a +
                50 * b +
                50 * c +
                25 * a * b},100%,${50 * (a + b)}%, ${1 -
                ((i / N) * (a - b)) / 2})`}
              periods={
                +(
                  (20 * (a + b + c)) / 1.5 -
                  10 * (i / N) * c
                ).toFixed(0)
              }
              exaggerate={Math.max(
                0,
                0.15 + (i / N) * (a + b - c)
              )}
              strokeWidth={Math.max(
                0.1,
                0.2 +
                  (i / N) * 0.2 * (a * b - b * c + c * a)
              )}
              R={Math.min(50, 50 * (a + c - b))}
            />
            <Trace
              stroke={`hsla(${210 -
                i * 720 * a +
                720 * b +
                720 * c +
                25 * a * b},100%,${50 * (a + b)}%, ${1 -
                ((i / N) * (a - b)) / 2})`}
              periods={
                +(
                  (20 * (a + b + c)) / 1.5 -
                  10 * (i / N) * c
                ).toFixed(0)
              }
              exaggerate={Math.max(
                0,
                0.15 + (i / N) * (a + b - c)
              )}
              strokeWidth={Math.max(
                0.1,
                0.2 +
                  (i / N) * 0.2 * (a * b + b * c + c * a)
              )}
              transform={`rotate(${(-(
                a * b +
                b * c +
                c * a
              ) *
                360) /
                +(
                  (20 * (a + b + c)) / 1.5 -
                  10 * (i / N) * c
                ).toFixed(0)} 0 0)`}
              R={Math.min(50, 50 * (a + c - b))}
            />
          </>
        );
      })}
    </animated.g>
  </svg>
);

function App() {
  const clock = useClock();
  const N = 12;
  const dim = 30 + (2 * Math.random() - 1);
  const frequency = 0.25;
  const slowDown = 2 ** 5;
  const oscillate = 10 / slowDown;
  const spin = 1 / slowDown;
  const [offX, offY] = [dim / 2, dim / 2];
  const [Rx, Ry] = [
    (50 - 5 - 0.5) / 2 ** 0.5,
    (50 - 5 - 0.5) / 2 ** 0.5,
  ];
  const [x, y] = [50 + Rx - offX, 50 + Ry - offY];

  return (
    <>
      <svg
        viewBox="0 0 200 200"
        height={'100vh'}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%,-50%)',
        }}
      >
        <g
          transform={`translate(100 100) scale(1.5) translate(-100 -100) translate(50 50)`}
        >
          <Trace />
          <Trace
            transform={`rotate(${360 / 10 / 2} 0 0)`}
          />
          {[...Array(N)].map(
            (
              _,
              j,
              __,
              a = Math.random(),
              fraction = Math.round((j / N) * 60 * 20) / 20
            ) => (
              <animated.g
                transform={clock.interpolate(
                  i =>
                    `translate(${x} ${y})
              rotate(${degrees(i * spin + fraction)} ${-(
                      Rx - offX
                    )} ${-(Ry - offY)})
                 translate(${((5 - 1.5) / 2) *
                   (1 +
                     (j % 2 === 0 ? cos : sin)(
                       radians(i * oscillate + fraction)
                     ))} ${((5 - 1.5) / 2) *
                      (1 +
                        (j % 2 === 0 ? cos : sin)(
                          radians(i * oscillate + fraction)
                        ))})
                `
                )}
              >
                <Flower
                  clock={clock}
                  width={dim}
                  height={dim}
                  frequency={frequency * (3 * a)}
                />
              </animated.g>
            )
          )}
        </g>
        <svg x="50" width="100" viewBox="0 0 250 85">
          <defs>
            <path
              id="text-path-0"
              d="M 96.531 316.796 C 209.344 286.611 304.851 288.599 421.575 318.918"
            />
          </defs>
          <g transform="translate(-140 -265)">
            <text
              fill="rgb(51,51,51)"
              fontFamily="Parisienne"
              style={{
                fontSize: '37.82px',
                strokeWidth: '1.34629px',
                whiteSpace: 'pre',
                vectorEffect: 'non-scaling-stroke',
              }}
            >
              <textPath href="#text-path-0">
                <tspan x="46.5313" y="387.683">
                  Happy Birthday
                </tspan>
                <tspan x="46.53129959106445" dy="0.6em">
                  ​
                </tspan>
                <tspan x="46.53129959106445" dy="0.6em">
                  ​
                </tspan>
                {/*prettier-ignore*/}
                <tspan>       Mom</tspan>
                <tspan x="46.53129959106445" dy="0.6em">
                  ​
                </tspan>
              </textPath>
              <tspan
                fontFamily="EB Garamond"
                x="155.53129959106445"
                y="375.683"
                dy="0.6em"
                fontSize=".85rem"
                whiteSpace="pre"
              >
                <tspan dx="40" dy=".6em">
                  Thanks for always taking
                </tspan>
                <tspan dx="-105" dy="1.5em">
                  good care of me.
                </tspan>
              </tspan>
            </text>
          </g>
        </svg>
      </svg>
    </>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
