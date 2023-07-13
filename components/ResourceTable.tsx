import {
  ActionIcon,
  Center,
  CloseButton,
  Group,
  Stack,
  Table,
  Text,
  TextInput,
  UnstyledButton,
  createStyles,
} from '@mantine/core';
import { IconChevronDown, IconChevronUp, IconSearch, IconSelector } from '@tabler/icons-react';
import { NarrowResource, ResourceMap, ResourceType } from 'types/resource';
import { useEffect, useMemo, useRef, useState } from 'react';

import ResourceItem from 'components/ResourceItem';

const useStyles = createStyles((theme) => ({
  th: {
    '&&': {
      padding: 0,
    },
  },
  heading: {
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,
    whiteSpace: 'nowrap',
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
  inputContainer: {
    marginRight: theme.spacing.md,
    alignSelf: 'flex-end',
  },
  placeholderMessage: {
    color: theme.colors.gray[6],
    margin: `0 ${theme.spacing.md} ${theme.spacing.xs}`,
  },
}));

type Props<TType extends ResourceType> = {
  data: NarrowResource<TType>[];
  isVisible: boolean;
  map: ResourceMap<TType>;
};

const searcherFn = (outer: string, inner: string) => outer.trim().toLowerCase().includes(inner.toLowerCase().trim());

export default function ResourceTable<TType extends ResourceType>(props: Props<TType>) {
  const { data, isVisible, map } = props;
  const { singularTerm, initialSort, fieldMappings } = map;

  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const [sortBy, setSortBy] = useState<keyof NarrowResource<TType>>(initialSort);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const { classes } = useStyles();

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [isVisible]);

  const setSorting = (field: keyof NarrowResource<TType>) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
  };

  const sortedAndFiltered = useMemo(() => {
    const filtered = data.filter((item) =>
      Object.entries(item).some(([key, value]) => {
        const isResourceValue = (value: any): value is NarrowResource<TType>[keyof NarrowResource<TType>] =>
          typeof value === 'string' || typeof value === 'number' || Array.isArray(value);

        const fieldMap = fieldMappings.find((field) => field.key === key);
        if (fieldMap?.transform && isResourceValue(value)) {
          return searcherFn(fieldMap.transform(value), query);
        }
        if (typeof value === 'string') {
          return searcherFn(value, query);
        }
        if (typeof value === 'number') {
          return searcherFn(value.toString(), query);
        }
        return searcherFn(value.join(''), query);
      }),
    );
    if (!sortBy) {
      return filtered;
    }
    return filtered.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        if (reverseSortDirection) {
          return bValue - aValue;
        }
        return aValue - bValue;
      }

      if (reverseSortDirection) {
        return String(b[sortBy]).localeCompare(String(a[sortBy]));
      }
      return String(a[sortBy]).localeCompare(String(b[sortBy]));
    });
  }, [data, fieldMappings, query, reverseSortDirection, sortBy]);

  return (
    <Stack>
      <TextInput
        placeholder='Search...'
        ref={searchRef}
        classNames={{ root: classes.inputContainer }}
        rightSection={
          query ? (
            <CloseButton size='md' variant='transparent' onClick={() => setQuery('')} />
          ) : (
            <ActionIcon size='md' variant='transparent'>
              <IconSearch />
            </ActionIcon>
          )
        }
        value={query}
        onChange={(e) => setQuery(e.currentTarget.value)}
      />
      {sortedAndFiltered.length === 0 ? (
        <Text className={classes.placeholderMessage}>No {singularTerm} resources found...</Text>
      ) : (
        <Table>
          <thead>
            <tr>
              {fieldMappings.map((field) => {
                const sorted = field.key === sortBy;
                const Icon = sorted ? (reverseSortDirection ? IconChevronUp : IconChevronDown) : IconSelector;
                return (
                  <th key={field.key.toString()} className={classes.th}>
                    <UnstyledButton onClick={() => setSorting(field.key)} className={classes.control}>
                      <Group position='apart' noWrap>
                        <Text className={classes.heading}>{field.heading}</Text>
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
            {sortedAndFiltered.map((resource) => (
              <ResourceItem key={resource.url} resource={resource} fieldMappings={fieldMappings} />
            ))}
          </tbody>
        </Table>
      )}
    </Stack>
  );
}
