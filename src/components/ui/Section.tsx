import React from 'react'
import styled from 'styled-components'

export default function Section({
  children,
  outerBgColor = 'white',
}: {
  children: any,
  outerBgColor?: string
}) {
  return (
    <Outer outerBgColor={outerBgColor}>
      <Inner>
        {children}
      </Inner>
    </Outer>
  )
}

const Outer = styled.div`
  width: 100%;

  ${({ outerBgColor }: { outerBgColor: string }) => `
    background-color: ${outerBgColor};
  `}
`

const Inner = styled.div`
  width: 1200px;
  margin: 0 auto;
  padding: 40px 0;
`