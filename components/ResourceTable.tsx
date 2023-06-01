import { Center, Group, Table, Text, Tooltip, UnstyledButton, createStyles } from '@mantine/core';
import { IconChevronDown, IconChevronUp, IconSelector } from '@tabler/icons-react';
import { useMemo, useState } from 'react';

import { Resource } from 'types/jnode';

const useStyles = createStyles((theme) => ({
  tr: {
    '&&:hover': {
      cursor: 'pointer',
      backgroundColor: theme.colors.gray[1],
    },
  },
  th: {
    '&&': {
      padding: 0,
    },
  },
  control: {
    width: '100%',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    '&:hover': {
      backgroundColor: theme.colors.gray[0],
    },
  },
  icon: {
    width: '1.5rem',
    height: '1.5rem',
    borderRadius: '1.5rem',
  },
}));

export type FieldMap<T extends Resource> = {
  key: keyof T;
  heading: string;
  transform?: (value: T[keyof T]) => string;
};

type Props<T extends Resource> = {
  fieldMappings: FieldMap<T>[];
  data: T[];
};

export default function ResourceTable<T extends Resource>(props: Props<T>) {
  const { fieldMappings, data } = props;
  const { classes } = useStyles();
  const [sortBy, setSortBy] = useState<keyof T | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const setSorting = (field: keyof T) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
  };

  const tableRowClickHandler = (url: string) => {
    window.open(url, '_blank', 'noreferrer');
  };

  const sortedData = useMemo(() => {
    if (!sortBy) {
      return data;
    }
    return [...data].sort((a, b) => {
      if (reverseSortDirection) {
        return String(b[sortBy]).localeCompare(String(a[sortBy]));
      }
      return String(a[sortBy]).localeCompare(String(b[sortBy]));
    });
  }, [data, reverseSortDirection, sortBy]);

  return (
    <Table>
      <thead>
        <tr>
          {fieldMappings.map((field) => {
            const sorted = field.key === sortBy;
            const Icon = sorted ? (reverseSortDirection ? IconChevronUp : IconChevronDown) : IconSelector;
            return (
              <th key={field.key.toString()} className={classes.th}>
                <UnstyledButton onClick={() => setSorting(field.key)} className={classes.control}>
                  <Group position='apart'>
                    <Text fw={500} fz='sm'>
                      {field.heading}
                    </Text>
                    <Center className={classes.icon}>
                      <Icon size='0.9rem' stroke={1.5} />
                    </Center>
                  </Group>
                </UnstyledButton>
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((item) => (
          <Tooltip key={item.url} label={item.url} openDelay={500}>
            <tr className={classes.tr} onClick={() => tableRowClickHandler(item.url)}>
              {fieldMappings.map((field) => (
                <td key={field.key.toString()}>{field.transform?.(item[field.key]) ?? String(item[field.key])}</td>
              ))}
            </tr>
          </Tooltip>
        ))}
      </tbody>
    </Table>
  );
}
