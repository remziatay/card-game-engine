import React from 'react'

function ArrowPiece (props) {
  const fillColor = props.fillColor || '#3975cc'
  return (
    <svg className={props.className} version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid meet" viewBox="191.12637362637366 187.82967032967 163.8 257.8900000000002">
      <defs>
        <path d="M340.84 390.33C346.96 390.33 351.93 395.29 351.93 401.42C351.93 409.68 351.93 423.37 351.93 431.63C351.93 437.76 346.96 442.72 340.84 442.72C311.4 442.72 234.16 442.72 204.71 442.72C198.59 442.72 193.63 437.76 193.63 431.63C193.63 423.37 193.63 409.68 193.63 401.42C193.63 395.29 198.59 390.33 204.71 390.33C234.16 390.33 311.4 390.33 340.84 390.33Z" id="bVoGsCJqj"></path>
        <path d="M341.14 190.33C347.1 190.33 351.93 195.16 351.93 201.12C351.93 242.76 351.93 356.9 351.93 398.54C351.93 404.5 347.1 409.33 341.14 409.33C311.63 409.33 233.92 409.33 204.42 409.33C198.46 409.33 193.63 404.5 193.63 398.54C193.63 356.9 193.63 242.76 193.63 201.12C193.63 195.16 198.46 190.33 204.42 190.33C233.92 190.33 311.63 190.33 341.14 190.33Z" id="bRVC48mdV"></path>
      </defs>
      <g>
        <use xlinkHref="#bRVC48mdV" opacity="1" fill={fillColor} fillOpacity=" 1"></use>
        <g><use xlinkHref="#bRVC48mdV" opacity="1" fillOpacity="0" stroke="#000000" strokeWidth="5" strokeOpacity="1"></use></g>
      </g>
      <g>
        <g>
          <use xlinkHref="#bVoGsCJqj" opacity="1" fill={fillColor} fillOpacity="1"></use>
          <g><use xlinkHref="#bVoGsCJqj" opacity="1" fillOpacity="0" stroke="#000000" strokeWidth="5" strokeOpacity="1"></use></g>
        </g>
      </g>
    </svg>
  )
}

export default ArrowPiece
