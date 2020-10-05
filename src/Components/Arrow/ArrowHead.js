import React from 'react'

function ArrowHead (props) {
  const fillColor = props.fillColor || '#3975cc'
  return (
    <svg className={props.className} version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="135.6984276372506 12.427102964159928 441.30424657534456 477.9602173501391">
      <defs>
        <path d="M273.46 221.7C275.42 221.7 277 223.28 277 225.24C277 234.59 277 259.13 277 268.48C277 270.44 275.42 272.02 273.46 272.02C246.41 272.02 168.79 272.02 141.73 272.02C139.78 272.02 138.2 270.44 138.2 268.48C138.2 259.13 138.2 234.59 138.2 225.24C138.2 223.28 139.78 221.7 141.73 221.7C168.79 221.7 246.41 221.7 273.46 221.7Z" id="bTrGSnVf2"></path>
        <path d="M570.47 221.7C572.42 221.7 574 223.28 574 225.24C574 234.59 574 259.13 574 268.48C574 270.44 572.42 272.02 570.47 272.02C543.41 272.02 465.79 272.02 438.74 272.02C436.79 272.02 435.2 270.44 435.2 268.48C435.2 259.13 435.2 234.59 435.2 225.24C435.2 223.28 436.79 221.7 438.74 221.7C465.79 221.7 543.41 221.7 570.47 221.7Z" id="dtPQlm4EN"></path>
        <path d="M431.61 435C433.65 435 435.3 436.65 435.3 438.68C435.3 448.42 435.3 473.96 435.3 483.71C435.3 485.74 433.65 487.39 431.61 487.39C400.69 487.39 311.6 487.39 280.68 487.39C278.64 487.39 277 485.74 277 483.71C277 473.96 277 448.42 277 438.68C277 436.65 278.64 435 280.68 435C311.6 435 400.69 435 431.61 435Z" id="aQCCizSuh"></path>
        <path d="M140.66 221.66L356.3 14.93L571.92 221.68L435.22 221.67L435.21 440.93L276.99 440.92L277 221.67L140.66 221.66Z" id="c1soVoUXff"></path>
      </defs>
      <g>
        <g>
          <use xlinkHref="#c1soVoUXff" opacity="1" fill={fillColor} fillOpacity="1"></use>
          <g><use xlinkHref="#c1soVoUXff" opacity="1" fillOpacity="0" strokeLinejoin="round" stroke="#000000" strokeWidth="5" strokeOpacity="1"></use></g>
        </g>
        <g>
          <use xlinkHref="#bTrGSnVf2" opacity="1" fill={fillColor} fillOpacity="1"></use>
          <g><use xlinkHref="#bTrGSnVf2" opacity="1" fillOpacity="0" stroke="#000000" strokeWidth="5" strokeOpacity="1"></use></g>
        </g>
        <g>
          <use xlinkHref="#dtPQlm4EN" opacity="1" fill={fillColor} fillOpacity="1"></use>
          <g><use xlinkHref="#dtPQlm4EN" opacity="1" fillOpacity="0" stroke="#000000" strokeWidth="5" strokeOpacity="1"></use></g>
        </g>
        <g>
          <use xlinkHref="#aQCCizSuh" opacity="1" fill={fillColor} fillOpacity="1"></use>
          <g><use xlinkHref="#aQCCizSuh" opacity="1" fillOpacity="0" stroke="#000000" strokeWidth="5" strokeOpacity="1"></use></g>
        </g>
      </g>
    </svg>
  )
}

export default ArrowHead
