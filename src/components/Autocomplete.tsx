import { useAutocomplete } from '@mui/base/useAutocomplete';
import { styled } from '@mui/system';
import { ProgramData } from '@/types/components';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import SearchIcon from '@mui/icons-material/Search';

// TODO: LET'S MAKE THIS PRETTIER OK

export default function Autocomplete({ classData }: { classData: ProgramData[] }) {
  const [value, setValue] = useState<ProgramData | null>(null);
  const [inputValue, setInputValue] = useState('');
  const t = useTranslations('program.autocomplete');

  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    focused,
  } = useAutocomplete({
    id: 'search-program-autocomplete',
    options: classData,
    getOptionLabel: (option) => option.title,
    value,
    onChange: (event, newValue) => setValue(newValue),
    inputValue,
    onInputChange: (event, newInputValue) => setInputValue(newInputValue),
  });

  return (
    <div>
      <StyledAutocompleteRoot
        {...getRootProps()}
        className={focused ? 'focused' : ''}
      >
        <SearchIcon />
        <StyledInput {...getInputProps()} placeholder={t('placeholder')} />
      </StyledAutocompleteRoot>
      {(inputValue.length > 0 && groupedOptions.length > 0) && (
        <StyledListbox {...getListboxProps()}>
          {(groupedOptions as ProgramData[]).map((option, index) => (
            <StyledOption key={option.title + index} {...getOptionProps({ option, index })}>
              {option.title}
            </StyledOption>
          ))}
        </StyledListbox>
      )}
      {(inputValue.length > 0 && groupedOptions.length === 0) && (
        <StyledListbox>
          <StyledOption>
            {t('empty')}
          </StyledOption>
        </StyledListbox>
      )}
    </div>
  );
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

const StyledAutocompleteRoot = styled('div')(
  ({ theme }) => `
  border-radius: 3.125rem;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[500]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  display: flex;
  gap: 0.5rem;
  overflow: hidden;
  width: 24rem;
  height: 48px;
  box-shadow: ${theme.shadows[1]};
  align-items: center;
  padding-left: 0.5rem;

  &.focused {
    border-color: ${blue[400]};
  }

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus-visible {
    outline: 0;
  }
`,
);

const StyledInput = styled('input')(
  ({ theme }) => `
  font-family: ${theme.typography.fontFamily};
  font-size: ${theme.typography.h6.fontSize}px;
  font-weight: 400;
  line-height: 120%;
  color: black;
  background: inherit;
  border: none;
  border-radius: inherit;
  padding-left: 5px;
  outline: 0;
  flex: 1 0 auto;
`,
);

const StyledListbox = styled('ul')(
  ({ theme }) => `
  box-sizing: border-box;
  margin: 12px 0;
  width: 24rem;
  border-radius: 12px;
  overflow: auto;
  outline: 0px;
  max-height: 300px;
  z-index: 1;
  position: absolute;
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  `,
);

const StyledOption = styled('li')(
  ({ theme }) => `
  list-style: none;
  padding: 8px;
  border-radius: 8px;
  cursor: default;

  &:last-of-type {
    border-bottom: none;
  }

  &:hover {
    cursor: pointer;
  }

  &[aria-selected=true] {
    background-color: ${theme.palette.mode === 'dark' ? blue[900] : blue[100]};
    color: ${theme.palette.mode === 'dark' ? blue[100] : blue[900]};
  }

  &.Mui-focused,
  &.Mui-focusVisible {
    background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]};
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  }

  &.Mui-focusVisible {
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[500] : blue[200]};
  }

  &[aria-selected=true].Mui-focused,
  &[aria-selected=true].Mui-focusVisible {
    background-color: ${theme.palette.mode === 'dark' ? blue[900] : blue[100]};
    color: ${theme.palette.mode === 'dark' ? blue[100] : blue[900]};
  }
  `,
);
