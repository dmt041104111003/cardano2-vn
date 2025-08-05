import { Mark, mergeAttributes } from '@tiptap/core';

export const LockMark = Mark.create({
  name: 'lockMark',

  addOptions() {
    return {
      HTMLAttributes: {
        style: 'background-color: #fed7aa; border: 2px solid #ea580c; border-radius: 4px; padding: 0 4px; font-weight: 500;',
      },
    };
  },

  addAttributes() {
    return {
      class: {
        default: null,
        parseHTML: element => element.getAttribute('class'),
        renderHTML: attributes => {
          if (!attributes.class) {
            return {};
          }
          return {
            class: attributes.class,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: (node: HTMLElement) => {
          return node.style.backgroundColor === 'rgb(254, 215, 170)' ? {} : false;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
}); 