import styled from "@emotion/styled";

const DOT_WIDTH = 10;
const DOT_COLOR = "#fff";
const SPEED = "1.5s";

const Typing = styled.div`
position: relative;
height: 1.2em;

span {
    content: '';
    animation: blink ${SPEED} infinite;
    animation-fill-mode: both;
    height: ${DOT_WIDTH}px;
    width: ${DOT_WIDTH}px;
    background: ${DOT_COLOR};
    position: absolute;
    left:0;
    top:0;
    border-radius: 50%;
    
    &:nth-child(2) {
      animation-delay: .2s;
      margin-left: ${DOT_WIDTH * 1.5}px;
    }

      &:nth-child(3) {
        animation-delay: .4s;
        margin-left: ${DOT_WIDTH * 3}px;
      }


      @keyframes blink {
        0% {
          opacity: .1;
        }
        20% {
          opacity: 1;
        }
        100% {
          opacity: .1;
        }
      }
`

export default function Conversation() {
    return (
        <Typing>
            <span></span>
            <span></span>
            <span></span>
        </Typing>

    );
};


