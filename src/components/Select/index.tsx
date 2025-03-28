import Select, {
  components,
  GroupBase,
  Props,
  DropdownIndicatorProps,
  PlaceholderProps,
} from 'react-select';

import Icon from '../Icon';
import './index.css';

export type Option = {
  value: string;
  label: string;
};

const DropdownIndicator = ({
  ...props
}: DropdownIndicatorProps<Option, false, GroupBase<Option>>) => {
  return (
    <components.DropdownIndicator
      {...props}
      className='flex aspect-square h-4 w-full items-center lg:h-5 3xl:h-6'
    >
      <Icon.Chevron className='flex rotate-180' height={'100%'} fill={'#5B5B5B'} />
    </components.DropdownIndicator>
  );
};

const Placeholder = ({
  children,
  ...props
}: PlaceholderProps<Option, false, GroupBase<Option>>) => {
  return (
    <components.Placeholder {...props}>
      <p className='text-ellipsis'>{children}</p>
    </components.Placeholder>
  );
};

const CustomSelect = ({
  options,
  onChange,
  isDisabled: disabled,
  ...props
}: Props<Option, false, GroupBase<Option>>) => {
  return (
    <Select
      options={options}
      onChange={onChange}
      unstyled
      classNamePrefix='react-select'
      className='react-select__container'
      menuPlacement='auto'
      isDisabled={disabled}
      isClearable
      styles={{
        control: (baseStyle, { isFocused }) => ({
          ...baseStyle,
          outline: isFocused ? '2px auto #4285F4' : 'unset',
          boxSizing: 'content-box',
        }),
        indicatorsContainer: (baseStyle, { isDisabled }) => ({
          ...baseStyle,
          display: isDisabled ? 'none' : baseStyle.display,
        }),
      }}
      classNames={{
        container: () =>
          `flex flex-1 w-full rounded-lg border border-[#CCC] ${
            disabled ? 'bg-[rgba(239,239,239,0.3)]' : ''
          }`,
        control: () =>
          'flex flex-1 rounded-lg items-center justify-center p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base',
        placeholder: () => 'h-full text-gray-400',
        menu: () => 'rounded-lg border border-[#CCC] p-2.5 my-2 bg-white',
        valueContainer: () => 'flex flex-1',
        option: () => 'text-sm font-normal hover:bg-[#F1F1F1] cursor-pointer p-2.5 rounded-lg',
      }}
      components={{ DropdownIndicator, Placeholder }}
      {...props}
    />
  );
};

export default CustomSelect;
