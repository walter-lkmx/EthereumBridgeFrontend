import * as React from 'react';
import { Box } from 'grommet';
import { observer } from 'mobx-react-lite';
import { Text } from 'components/Base';
import cn from 'classnames';
import * as styles from './feeds.styl';
import { useStores } from 'stores';
import { EXCHANGE_MODE } from 'stores/interfaces';
import { SwapStatus } from '../../constants';
import { truncateAddressString } from 'utils';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Icon } from 'components/Base';

const AssetRow = props => {
  return (
    <Box
      direction="row"
      justify="between"
      margin={{ bottom: 'medium' }}
      align="start"
    >
      <Box>
        <Text size="small" bold={true}>
          {props.label}
        </Text>
      </Box>
      <Box direction="row" align="center">
        {props.address ? (
          <a href={props.link}>
            <Text
              size="small"
              style={{
                fontFamily: 'monospace',
              }}
            >
              {props.address ? truncateAddressString(props.value) : props.value}
            </Text>
          </a>
        ) : (
          <>
            {props.value ? <Text size="small">{props.value}</Text> : null}
            {props.children}
          </>
        )}

        {props.after && (
          <Text style={{ marginLeft: 5 }} color="Basic500">
            {props.after}
          </Text>
        )}
        {props.address && (
          <CopyToClipboard text={props.value}>
            <Icon
              glyph="PrintFormCopy"
              size="1em"
              color="#1c2a5e"
              style={{ marginLeft: 10, width: 20 }}
            />
          </CopyToClipboard>
        )}
      </Box>
    </Box>
  );
};

const ProgressBar = ({ status }) => {
  const statusProgress = {
    [SwapStatus.SWAP_WAIT_SEND]: 33,
    [SwapStatus.SWAP_SENT]: 66,
    [SwapStatus.SWAP_CONFIRMED]: 100
  }
  return (
    <>
      <div className={styles.progress}>
        <div className={styles.bar} style={{ width: `${statusProgress[status]}%` }}></div>
      </div>
    </>
  )
}

const StepNumber = ({ step, isActive }) => {
  return (
    <>
      <div className={ isActive ? [styles.stepNumber, styles.stepNumberActive].join(' ') : styles.stepNumber }>{step}</div>
    </>
  )
}

const StepRow = ({
  status,
  srcTransactionHash,
  dstTransactionHash,
  type,
  txId,
}: {
  status: number;
  srcTransactionHash: string;
  dstTransactionHash?: string;
  type: EXCHANGE_MODE;
  txId?: string;
}) => {
  const label = StatusDescription[status];

  const textStyle =
    status === SwapStatus.SWAP_FAILED ? styles.failed : styles.active;

  const textClassName = cn(styles.stepRow, textStyle);

  return (
    <Box
      direction="column"
      margin={{ bottom: 'medium' }}
    >
      <h3>Loading your bridge transaction...</h3>

      <ProgressBar status={status}/>

      <div className={ styles.step }>
        <StepNumber step={1} isActive={status === SwapStatus.SWAP_WAIT_SEND}></StepNumber>
        <div className={ styles.text }>
          <h4>{WalletTypeMessages[type].firstStep}</h4>
            <p>{srcTransactionHash ? 
            <a
              href={`${process.env.ETH_EXPLORER_URL}/tx/${srcTransactionHash}`}
              style={{ textDecoration: 'none' }}
              target="_blank"
            >
              <AssetRow
                label="Your TX hash is:"
                value={srcTransactionHash}
                address={true}
              />
            </a>
                : null}</p>
        </div>
      </div>

      <div className={ styles.step }>
        <StepNumber step={2} isActive={status === SwapStatus.SWAP_SENT}></StepNumber>
        <div className={ styles.text }>
          <h4>Wait for 6 blocks</h4>
          <p>The waiting period is required to ensure finality</p>
          </div>
      </div>

      <div className={ styles.step }>
        <StepNumber step={3} isActive={status === SwapStatus.SWAP_CONFIRMED}></StepNumber>
        <div className={ styles.text }>
          <h4>{WalletTypeMessages[type].lastStep}</h4>
        </div>
      </div>
    </Box>
  );
};

const WalletType: Record<EXCHANGE_MODE, string> = {
  [EXCHANGE_MODE.ETH_TO_SCRT]: 'Metamask',
  [EXCHANGE_MODE.SCRT_TO_ETH]: 'Keplr',
};

const WalletTypeMessages: Record<EXCHANGE_MODE, any> = {
  [EXCHANGE_MODE.ETH_TO_SCRT]: {
    firstStep: 'Ethereum transaction [pending / confirmed]',
    lastStep: 'Secret Network transaction [pending / confirmed]'
  },
  [EXCHANGE_MODE.SCRT_TO_ETH]: {
    firstStep: 'Secret Network transaction [pending / confirmed]',
    lastStep: 'Ethereum multisig transaction [broadcasted/ pending / confirmed]'
  },
};

const StatusDescription: Record<SwapStatus, string> = {
  [SwapStatus.SWAP_UNSIGNED]:
    'Bridge confirmed transaction, waiting for Signatures',
  [SwapStatus.SWAP_SIGNED]: 'Bridge transaction signed, waiting for broadcast',
  [SwapStatus.SWAP_SUBMITTED]:
    'Bridge transaction sent, waiting for confirmation',
  [SwapStatus.SWAP_CONFIRMED]: 'Transfer complete!',
  [SwapStatus.SWAP_FAILED]:
    'Transfer failed! Please go to #🌉bridge-support on https://chat.scrt.network for more details and specify your operation ID.',
  [SwapStatus.SWAP_RETRY]: 'Failed to broadcast transaction. Retrying...',
  [SwapStatus.SWAP_SENT]:
    'Sent Transaction... waiting for on-chain confirmation',
  [SwapStatus.SWAP_WAIT_SEND]: 'Waiting for user transaction ',
  [SwapStatus.SWAP_WAIT_APPROVE]: 'Waiting for allowance',
};

export const Steps = observer(() => {
  const { exchange, user } = useStores();

  if (!exchange.operation) {
    return null;
  }

  const status = exchange.operation.status;
  return (
    <Box direction="column" className={styles.stepsContainer}>
      <StepRow
        key={status}
        status={status}
        srcTransactionHash={exchange.txHash}
        type={exchange.mode}
        txId={exchange.operation.id}
      />
    </Box>
  );
});
