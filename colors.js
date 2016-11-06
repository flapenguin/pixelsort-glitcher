const Colors = {
  rgb(uint32) {
    const r = (uint32 >>> 0) & 0xff;
    const g = (uint32 >>> 8) & 0xff;
    const b = (uint32 >>> 16) & 0xff;
    const a = (uint32 >>> 24) & 0xff;
    return {
      r, g, b, a,
      valueOf: () => 0.2126*r + 0.7152*g + 0.0722*b
    };
  },

  red(uint32) { return Colors.rgb(uint32).r; },
  green(uint32) { return Colors.rgb(uint32).g; },
  blue(uint32) { return Colors.rgb(uint32).b; },
  grey(uint32) { return Colors.rgb(uint32).valueOf() },

  sort: {
    byBrigtness(a, b) {
      return Colors.brightness(a) < Colors.brightness(b);
    },
    byRed(a, b) {
      return Colors.rgb(a).r < Colors.rgb(b).r;
    }
  }
};

module.exports = Colors;
