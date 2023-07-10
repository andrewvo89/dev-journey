import { Anchor, Button, Stack, Text, Title, createStyles } from '@mantine/core';
import { IconBrandGithub, IconCoffee } from '@tabler/icons-react';
import { bmacUrl, githubUrl, issuesUrl } from 'utils/common';

const useStyles = createStyles((theme) => ({
  bmacButton: {
    backgroundColor: '#ffdd00',
    color: theme.black,
    ':hover': {
      backgroundColor: '#ffdd00',
    },
  },
  ghButton: {
    backgroundColor: theme.black,
    color: theme.white,
    ':hover': {
      backgroundColor: theme.black,
    },
  },
}));

export default function About() {
  const { classes } = useStyles();
  return (
    <Stack align='flex-start'>
      <Text>
        Dev Journey is a free-to-use tool for aspiring developers and existing developers looking to explore new
        pathways. It's an interactive tool that displays the different pathways developers can take to reach their
        desired destination. Each destination includes a collection of resources that can assist you on your journey.
        These resources include articles, books, courses, videos, and more.
      </Text>
      <Text>
        Dev Journey can facilitate your learning by providing a bookmark feature, allowing you to save resources,
        journeys, and destinations for later use. You can also view your history to recall your previous prompts.
      </Text>
      <Text>
        Dev Journey doesn't require you to create an account to use the tool. All your history and bookmarks are stored
        in your browser and are not stored on a server elsewhere. To use this tool across multiple browsers, you'll need
        to export your data and import it into another browser.
      </Text>
      <Title order={3}>Contributing</Title>
      <Text>
        All resources are manually screened and input into the application. The dataset is open-source and available in
        this{' '}
        <Anchor href={githubUrl} target='_blank' rel='noopener noreferrer'>
          GitHub repository
        </Anchor>
        . To contribute, amend, or remove any data, please raise an issue in the GitHub repository.
      </Text>
      <Button
        className={classes.ghButton}
        component='a'
        href={`${issuesUrl}/new`}
        target='_blank'
        rel='noopener noreferrer'
        leftIcon={<IconBrandGithub />}
      >
        Raise an issue
      </Button>
      <Title order={3}>Donating</Title>
      <Text>
        Dev Journey is free to use, but it is not free to maintain. If you're interested in supporting the development
        and upkeep of Dev Journey, please consider making a donation.
      </Text>
      <Button
        className={classes.bmacButton}
        component='a'
        href={bmacUrl}
        target='_blank'
        rel='noopener noreferrer'
        leftIcon={<IconCoffee />}
      >
        Buy me a coffee
      </Button>
    </Stack>
  );
}
