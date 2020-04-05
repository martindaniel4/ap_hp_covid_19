import React  from 'react'
import styled from 'styled-components'

export function BigNumber({ number, label}) {
  return (
    <BigNumberContainer>
      <BigNumberLabel>{number}</BigNumberLabel>
      <div>{label}</div>
    </BigNumberContainer>
  )
}

const BigNumberContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
`

const BigNumberLabel = styled.div`
  font-size: 40px;
  font-weight: bold;
  margin-right: 5px;
`