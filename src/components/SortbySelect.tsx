import { useTranslations } from 'next-intl';
import * as React from 'react';
import {
  Select as BaseSelect,
  SelectProps,
  selectClasses,
  SelectRootSlotProps,
} from '@mui/base/Select';
import { Option as BaseOption, optionClasses } from '@mui/base/Option';
import { Popper as BasePopper } from '@mui/base/Popper';
import { styled } from '@mui/material/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { SortBy } from '@/types/components';

// Personally, fuck MUI base.
// TODO: Make this prettier! ^w^

type SortBySelectProps = {
  onChange: (newValue: SortBy) => void;
  currentValue: SortBy;
}

export default function SortBySelect({ onChange, currentValue }: SortBySelectProps) {
  const t = useTranslations('program.select')
  const list = [{ value: 'ALL', text: t('all') }, { value: 'FREE', text: t('free') }, { value: 'PAID', text: t('paid') }]
  return (
    <Select defaultValue={list[0].value} value={currentValue} onChange={(_, newValue) => onChange(newValue as SortBy)} >
      {
        list.map((l, idx) => <Option value={l.value} key={l.value + idx}>{l.text}</Option>)
      }
    </Select>
  );
}

function Select(props: SelectProps<string, false>) {
  const slots: SelectProps<string, false>['slots'] = {
    root: StyledButton,
    listbox: Listbox,
    popper: Popper,
    ...props.slots,
  };

  return <BaseSelect {...props} slots={slots} />;
}
const blue = {
  100: '#DAECFF',
  200: '#99CCF3',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
  900: '#003A75',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const CustomButton = React.forwardRef(function CustomButton(
  props: SelectRootSlotProps<string, false>,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  const { ownerState, ...other } = props;
  return (
    <button
      type="button"
      {...other}
      ref={ref}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <span>{other.children}</span>
      <KeyboardArrowDownIcon />
    </button>
  );
});

const StyledButton = styled(CustomButton, { shouldForwardProp: () => true })(
  ({ theme }) => `
  font-family: inherit;
  border: none;
  position: relative;
  box-sizing: border-box;
  min-width: 150px;
  padding: 0.75rem 1rem;
  border-radius: 100px;
  text-align: left;
  line-height: 1.2;
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  color: black;
  box-shadow: ${theme.shadows[1]};

  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 120ms;

  &:hover {
    background: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
  }

  &.${selectClasses.focusVisible} {
    outline: 0;
  }

  & > svg {
    font-size: 1rem;
    position: absolute;
    height: 100%;
    top: 0;
    right: 10px;
  }
  `,
);

const Listbox = styled('ul')(
  ({ theme }) => `
 padding: 1.5rem;
 text-align: center;
 background: white;
 border-radius: 0.5rem;
 margin: 6px;
 box-shadow: ${theme.shadows[1]} 
  `,
);

const Option = styled(BaseOption)(
  ({ theme }) => `
 fontWeight: 500;
 list-style: none;
  padding: 8px;
  border-radius: 8px;
  cursor: default;

  &:last-of-type {
    border-bottom: none;
  }

  &.${optionClasses.selected} {
    background-color: ${theme.palette.mode === 'dark' ? blue[900] : blue[100]};
    color: ${theme.palette.mode === 'dark' ? blue[100] : blue[900]};
  }

  &.${optionClasses.highlighted} {
    background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]};
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  }

  &.${optionClasses.highlighted}.${optionClasses.selected} {
    background-color: ${theme.palette.mode === 'dark' ? blue[900] : blue[100]};
    color: ${theme.palette.mode === 'dark' ? blue[100] : blue[900]};
  }

  &.${optionClasses.disabled} {
    color: ${theme.palette.mode === 'dark' ? grey[700] : grey[400]};
  }

  &:hover:not(.${optionClasses.disabled}) {
    background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]};
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  }
  `,
);

const Popper = styled(BasePopper)`
  z-index: 1;
`;
