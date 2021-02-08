import React from 'react';
import { Container, Image } from 'semantic-ui-react';
import { CSSProperties } from 'styled-components';
import { flexRowSpace, Pair, TokenDisplay } from '.';

export class LiquidityRow extends React.Component<{
  lpTokenSymbol: string;
  tokens: {
    [symbol: string]: TokenDisplay;
  };
  balances: {
    [symbol: string]: number | JSX.Element;
  };
}> {
  constructor(props) {
    super(props);
  }

  render() {
    const pairSymbol = this.props.lpTokenSymbol.replace('LP-', '');
    const [tokenA, tokenB] = pairSymbol.split('/');

    const lpTokenBalance = this.props.balances[this.props.lpTokenSymbol];
    const lpTokenTotalSupply = this.props.balances[
      this.props.lpTokenSymbol + '-total-supply'
    ];

    let lpShare = 0;
    let lpShareJsxElement = lpTokenBalance; // View Balance
    let pooledTokenA = lpTokenBalance; // View Balance
    let pooledTokenB = lpTokenBalance; // View Balance

    if (!isNaN(Number(lpTokenBalance))) {
      if (lpTokenTotalSupply > 0) {
        lpShare = Number(lpTokenBalance) / Number(lpTokenTotalSupply);

        let nf = new Intl.NumberFormat('en-US', {
          maximumFractionDigits: 6,
          useGrouping: false,
        });
        pooledTokenA = Number(
          nf.format(
            lpShare * Number(this.props.balances[`${tokenA}-${pairSymbol}`]),
          ),
        );

        pooledTokenB = Number(
          nf.format(
            lpShare * Number(this.props.balances[`${tokenB}-${pairSymbol}`]),
          ),
        );

        nf = new Intl.NumberFormat('en-US', {
          maximumFractionDigits: 2,
          useGrouping: false,
        });
        lpShareJsxElement = (
          <span>{`${nf.format(
            (Number(lpTokenBalance) * 100) / Number(lpTokenTotalSupply),
          )}%`}</span>
        );
      } else {
        lpShareJsxElement = <span>0%</span>;
      }
    }

    const getLogo = (symbol: string) => (
      <Image
        src={this.props.tokens[symbol].logo}
        avatar
        style={{
          boxShadow: 'rgba(0, 0, 0, 0.075) 0px 6px 10px',
          borderRadius: '24px',
          maxHeight: '24px',
          maxWidth: '24px',
        }}
      />
    );

    const rowStyle: CSSProperties = {
      display: 'flex',
      flexDirection: 'row',
      padding: '0.5em 0 0 0',
    };

    return (
      <Container
        style={{
          padding: '1rem',
          borderRadius: '20px',
          border: '1px solid rgb(247, 248, 250)',
          backgroundColor: 'white',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          {getLogo(tokenA)}
          {getLogo(tokenB)}
          <span
            style={{
              fontSize: '16px',
              fontWeight: 'bold',
              margin: 'auto',
            }}
          >
            {pairSymbol}
          </span>
          {flexRowSpace}
        </div>
        <div style={rowStyle}>
          <span>Your Total Pool Tokens</span>
          {flexRowSpace}
          {lpTokenBalance}
        </div>
        {!isNaN(Number(lpTokenBalance)) && (
          <>
            <div style={rowStyle}>
              <span style={{ margin: 'auto' }}>{`Pooled ${tokenA}`}</span>
              {flexRowSpace}
              <span style={{ margin: 'auto', paddingRight: '0.3em' }}>
                {pooledTokenA}
              </span>
              {getLogo(tokenA)}
            </div>
            <div style={rowStyle}>
              <span style={{ margin: 'auto' }}>{`Pooled ${tokenB}`}</span>
              {flexRowSpace}
              <span style={{ margin: 'auto', paddingRight: '0.3em' }}>
                {pooledTokenB}
              </span>
              {getLogo(tokenB)}
            </div>
            <div style={rowStyle}>
              <span>Your Pool Share</span>
              {flexRowSpace}
              {lpShareJsxElement}
            </div>
            {/*    <div style={rowStyle}>
              {flexRowSpace}
              <span>TODO "Remove Liquidity" panel</span>
              {flexRowSpace}
            </div> */}
          </>
        )}{' '}
      </Container>
    );
  }
}