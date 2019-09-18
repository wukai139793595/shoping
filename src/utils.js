const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }
  
//时间戳转时间
const unixTimestamp = data =>{
  var date = (data+'').length>10? new Date( data*1 ) : new Date(data*1000);
  return formatTime(date);
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
//金额格式化
const numberFormat=function(number, decimals, dec_point, thousands_sep){
    　　/*
       * 参数说明：
       * number：要格式化的数字
       * decimals：保留几位小数
       * dec_point：小数点符号
       * thousands_sep：千分位符号
       * */
    number = (number + '').replace(/[^0-9+-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
      prec = !isFinite(+decimals) ? 2 : Math.abs(decimals),
      sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
      dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
      s = '',
      toFixedFix = function (n, prec) {
        var k = Math.pow(10, prec);
        return '' + Math.ceil(n * k) / k;
      };
 
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    var re = /(-?\d+)(\d{3})/;
    while (re.test(s[0])) {
      s[0] = s[0].replace(re, "$1" + sep + "$2");
    }
  
    if ((s[1] || '').length < prec) {
      s[1] = s[1] || '';
      s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
  }
  //取消金额格式化
  const rmoney = val=>{
    return parseFloat(val.replace(/[^\d\.-]/g, ""));
  }
  //验证手机号
const checkPhone = (data)=>{
    var phoneReg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;
    if(data=='' || !phoneReg.test(data)){
      return false;
    }else{
      return true;
    }
  }

  module.exports={
    formatTime: formatTime,
    numberFormat: numberFormat,
    rmoney:rmoney,
    checkPhone:checkPhone,
    unixTimestamp:unixTimestamp
  }