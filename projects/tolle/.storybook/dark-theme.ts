import {create, themes} from 'storybook/theming';

export default create({
  ...themes.dark,
  base: 'dark',
  brandTitle: 'Tolle UI',
  brandUrl: 'https://tolle-ui.com',
  brandImage: './tolle-white.png',
  brandTarget: '_blank',
  colorPrimary: '#551a65',
});
