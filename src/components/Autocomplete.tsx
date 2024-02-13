import { useAutocomplete } from '@mui/base/useAutocomplete';
import { styled } from '@mui/material/styles';
import { ProgramData } from '@/types/components';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from '@mui/material';
import { databaseToUrlFormatted } from '@/lib/utils';

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
            <Link href={`program/${databaseToUrlFormatted(option.title)}`} key={option.title + index} 
            sx={{ textDecoration: 'none', 'color': 'black'}}
            >
              <StyledOption {...getOptionProps({ option, index })}>
                {option.title}
              </StyledOption>
            </Link>
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

const grey = {
  200: '#DAE2ED',
  500: '#9DA8B7',
  900: '#1C2025',
};

const moncohrome = {
  50: 'rgba(239, 208, 211, 0.2)',
  100: 'rgba(239, 208, 211, 0.4)',
};


const StyledAutocompleteRoot = styled('div')(
  ({ theme }) => `
  border-radius: 3.125rem;
  color: ${grey[500]};
  background: #fff;
  display: flex;
  gap: 0.5rem;
  overflow: hidden;
  width: ${theme.breakpoints.up("md") ? "13rem" : "24rem"};
  height: 48px;
  box-shadow: ${theme.shadows[1]};
  align-items: center;
  padding-left: 0.5rem;

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

const StyledListbox = styled('ul')(() => `
  box-sizing: border-box;
  margin: 12px 0;
  width: 24rem;
  border-radius: 12px;
  overflow: auto;
  outline: 0px;
  max-height: 300px;
  z-index: 1;
  position: absolute;
  background: #fff;
  border: 1px solid ${grey[200]};
  color: ${grey[900]};
  `,
);

const StyledOption = styled('li')(() => `
  list-style: none;
  padding: 16px;
  border-radius: 8px;
  cursor: default;

  &:last-of-type {
    border-bottom: none;
  }

  &:hover {
    cursor: pointer;
  }

  &.Mui-focused,
  &.Mui-focusVisible {
    background-color: ${moncohrome[100]};
    color: ${grey[900]};
  }
  `,
);
