//题目管理页面
var app2 = angular.module('app.subMan',[]);
//控制器
app2.controller('subManController',function ($scope,subManService,$routeParams) {
   //题目类型
    subManService.getAllType(function (data) {
        $scope.types = data;
    });
    //题目难度
    subManService.getAllLevel(function (data) {
        $scope.levels = data;
    });
    //题目方向
    subManService.getAllDepartment(function (data) {
        $scope.departments = data;
    });
    //题目知识点
    subManService.getAllTopic(function (data) {
        $scope.topics = data;
    });
    console.log($routeParams);// Object { a="0",  b="0",  c="0",  更多...}
    $scope.params = $routeParams;
    //获取所有题目
    subManService.getAllSubject($scope.params,function (subjects) {
        console.log(subjects);
    })
});
//服务  用于获取数据
app2.service('subManService',function ($http) {
    this.getAllType = function (fun) {//题目类型
        $http.get('http://172.16.0.5:7777/test/exam/manager/getAllSubjectType.action').success(function (data) {
            fun(data);
        });
    },
    this.getAllLevel = function (fun) {//题目难度
        $http.get('http://172.16.0.5:7777/test/exam/manager/getAllSubjectLevel.action').success(function (data) {
            fun(data);
        });
    },
    this.getAllDepartment = function (fun) {//题目方向
         $http.get('http://172.16.0.5:7777/test/exam/manager/getAllDepartmentes.action').success(function (data) {
             fun(data);
         });
    },
    this.getAllTopic = function (fun) {
        $http.get('http://172.16.0.5:7777/test/exam/manager/getAllTopics.action').success(function (data) {
            fun(data);
        });
    },
    this.getAllSubject = function (subData,fun) {
        //声明一个空对象
        var subDatas = {};
        for(var key in subData){
            console.log(key);//a b c d
            console.log(subData[key]);//0 0 0 0
            var val = subData[key];
            if(val!=0){
                switch (key){
                    case 'a':
                        subDatas['subject.subjectType.id'] = val;
                        break;
                    case 'b':
                        subDatas['subject.subjectLevel.id'] = val;
                        break;
                    case 'c':
                        subDatas['subject.department.id'] = val;
                        break;
                    case 'd':
                        subDatas['subject.topic.id'] = val;
                        break;
                }
            }
        };
        console.log(subDatas);
        $http.get('#',{
            params:subDatas
        }).success(function (data) {
            fun(data);
        });
    }
});