try {
    console.log(eval('a223;\n2;\nas2d\n'));
} catch (e) {
        console.log(e.stack.replace(/[\n\r].+?(\d+):(\d+)\)[\n\r][^\u0800]+/,' (Line $1 Column $2)'));
}
