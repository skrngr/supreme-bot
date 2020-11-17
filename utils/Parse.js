const Parse = {
  cmd: d => {
    let input = d
      .replace(/\n/i, "")
      .trim()
      .split(" ");
    let cmd = input[0];
    let opt = input[1];
    let vals = Array.from(input.slice(2));

    return { cmd, opt, vals };
  }
};

export default Parse;
