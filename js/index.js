//jQuery
$(function () {
    //将试卷管理和考试管理默认收起来
    $('.baseUI>li>ul').slideUp();
    $('.baseUI>li>ul').eq(0).slideDown();
    //解绑
    $('.baseUI>li>ul').off('click');
    //绑定事件
    $('.baseUI>li').on('click',function (event) {
        //console.log($(this));
        if($(this).children('ul').css('display','none')){
            $('.baseUI>li>ul').slideUp();
            $(this).children('ul').slideDown();
        }
    });
    //当点击全部题目的时候全部题目的颜色改变
    $('.baseUI>li>ul>li').on('click',function (event) {
        //console.log(this);
        if(!$(this).hasClass('current')){
            $(this).addClass('current').siblings().removeClass('current');
        }
    });
    //页面一开始就加载进来   模拟点击事件
     $(document).ready(function () {
     $('.baseUI>li>ul>li').eq(0).find('a').trigger('click');
     });
});


//angular
var app = angular.module('myApp',['ngRoute','app.allSubject','app.subMan']);
//点击全部题目的时候全部题目的页面加载上来
app.config(function ($routeProvider) {
    $routeProvider.when('/AllSubject/a/:a/b/:b/c/:c/d/:d',{//全部题目
        templateUrl:'tpl/allSubject.html',
        controller:'allSubController'
    }).when('/SubjectManage/a/:a/b/:b/c/:c/d/:d',{//题目管理
        templateUrl:'tpl/subjectManage.html',
        controller:'subManController'
    });
});