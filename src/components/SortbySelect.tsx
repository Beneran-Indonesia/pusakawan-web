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

const grey = {
  50: 'rgba(239, 208, 211, 0.2)',
  100: 'rgba(239, 208, 211, 0.4)',
};

const CustomButton = React.forwardRef(function CustomButton(
  props: SelectRootSlotProps<string, false>,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  const { ...other } = props;
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
  background: #fff;
  color: black;
  box-shadow: ${theme.shadows[1]};

  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 120ms;

  &:hover {
    background: ${grey[50]};
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
    background-color: ${grey[100]};
    color: ${theme.palette.primary.main};
  }

  &.${optionClasses.highlighted} {
    background-color: ${grey[100]};
    color: ${theme.palette.primary.main};
  }

  &.${optionClasses.highlighted}.${optionClasses.selected} {
    background-color: ${grey[100]};
    color: ${theme.palette.primary.main};
  }

  &:hover:not(.${optionClasses.disabled}) {
    background-color: ${grey[100]};
  }`,
);

const Popper = styled(BasePopper)`
  z-index: 1;
`;
