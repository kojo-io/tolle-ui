import {create, themes} from 'storybook/theming';

export default create({
  ...themes.light,
  base: 'light',
  brandTitle: 'Tolle UI',
  brandUrl: 'https://tolle-ui.com',
  brandImage: './tolle-black.png',
  brandTarget: '_blank',
});
