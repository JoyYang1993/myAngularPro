//angular
var app1 = angular.module('app.allSubject',[]);


//allSubject.html的控制器
app1.controller('allSubController',function ($scope,allSubService,$location,$routeParams) {
    //方向
    allSubService.findAllType(function (data) {
        $scope.types = data;
        //console.log($scope.types);
    });
    //等级
    allSubService.findAllLevel(function (data) {
        $scope.levels = data;
    });
    //方向
    allSubService.findAllDepartment(function (data) {
        $scope.departmentes = data;
    });
    //知识点
    allSubService.findAllTopics(function (data) {
        $scope.topics = data;
    });
    //查询
    //$routeParams获取到的是浏览器中地址的参数值
    //console.log($routeParams);
    $scope.params = $routeParams;
    //console.log($scope.params);

    //题目展示在页面
    allSubService.getAllSubjects($scope.params,function (subjects) {
        //subjects就是返回给我们包含所有的那个类似于subjects.json的数据[{},{}]
        //增加A B C D
        angular.forEach(subjects,function (subject) {//{},{}
           if(subject.subjectType!=null){
               //判断一下不是简答
                if(subject.subjectType.id!=3){
                    angular.forEach(subject.choices,function (choice,index) {
                        //console.log(choice);
                        //console.log(index);
                        choice.no = allSubService.indexChange(index);
                        // console.log(choice.no);
                    });
                    var choicess = [];
                    angular.forEach(subject.choices,function (choice) {
                        //console.log(choice);
                        if(choice.correct == true){
                            choicess.push(choice.no);
                        }
                    });
                    subject.answer = choicess.join(',');
                }
           }
        });
        $scope.subjects = subjects;//subjects就是返回给我们包含所有的那个类似于subjects.json的数据[{},{}]
    });
    //点击单个添加题目，单个添加题目的页面加载进来
    $scope.addSingleSubject = function () {
        $location.path('/addSingleSubject');
    };
});


//服务
app1.provider('allSubService',function () {
    this.$get = function ($http,$httpParamSerializer) {
        return {
            findAllType:function (fun) {//请求所有的题目类型
                /*$http.get('http://172.16.0.5:7777/test/exam/manager/getAllSubjectType.action').success(function (data) {
                    fun(data);
                });*/
                $http.get('data/types.json').success(function (data) {
                    fun(data);
                });
            },
            findAllLevel:function (fun) {//请求等级
               /* $http.get('http://172.16.0.5:7777/test/exam/manager/getAllSubjectLevel.action').success(function (data) {
                    fun(data);
                });*/
                $http.get('data/levels.json').success(function (data) {
                    fun(data);
                });
            },
            findAllDepartment:function (fun) {//请求方向
                /*$http.get('http://172.16.0.5:7777/test/exam/manager/getAllDepartmentes.action').success(function (data) {
                    fun(data);
                });*/
                $http.get('data/departmentes.json').success(function (data) {
                    fun(data);
                });
            },
            findAllTopics:function (fun) {//请求知识点
                /*$http.get('http://172.16.0.5:7777/test/exam/manager/getAllTopics.action').success(function (data) {
                    fun(data);
                });*/
                $http.get('data/topics.json').success(function (data) {
                    fun(data);
                });
            },
            getAllSubjects:function (subjectData,fun) {//请求所有的题目
                //声明一个对象
                var subjectData1 = {};
                for(var key in subjectData){
                    //console.log(key);
                    var val =subjectData[key];
                    // console.log(val);
                    if(val!=0){
                        switch(key){
                            case 'a':
                                subjectData1['subject.subjectType.id'] = val;
                                break;
                            case 'b':
                                subjectData1['subject.subjectLevel.id'] = val;
                                break;
                            case 'c':
                                subjectData1['subject.department.id'] = val;
                                break;
                            case 'd':
                                subjectData1['subject.topic.id'] = val;
                                break;
                        }
                    }
                }
                // console.log(subjectData1);
                /*$http.get('http://172.16.0.5:7777/test/exam/manager/getAllSubjects.action?',{
                    params:subjectData1
                }).success(function (data) {
                    fun(data);
                })*/
                $http.get('data/subjects.json',{
                    params:subjectData1
                }).success(function (data) {
                    fun(data);
                })
            },
            indexChange:function (index) {//添加A B C D
                return index == 0?'A':(index == 1?'B':(index == 2?'C':'D'))
            },
            addSubject:function (addSubjects,fun) {//添加题目
                //发送数据之前转换一下，以便后台可以认识
                //声明一个空对象
                var addSubjectsData = {};
                for(var key in addSubjects){
                    console.log(key)
                    var val =addSubjects[key];
                    console.log(val);
                    if(val){
                        switch(key){
                            case 'typeID':
                                addSubjectsData['subject.subjectType.id'] = val;
                                break;
                            case 'levelID':
                                addSubjectsData['subject.subjectLevel.id'] = val;
                                break;
                            case 'departmentID':
                                addSubjectsData['subject.department.id'] = val;
                                break;
                            case 'topicID':
                                addSubjectsData['subject.topic.id'] = val;
                                break;
                            case 'stem':
                                addSubjectsData['subject.stem'] = val;
                                break;
                            case 'answer':
                                addSubjectsData['subject.answer'] = val;
                                break;
                            case 'answerAnalysis':
                                addSubjectsData['subject.analysis'] = val;
                                break;
                            case 'choiceCorrect':
                                addSubjectsData['choiceCorrect'] = val;
                                break;
                            case 'choiceContent':
                                addSubjectsData['choiceContent'] = val;
                        }
                    }
                }
                console.log(addSubjectsData);
                addSubjectsData = $httpParamSerializer(addSubjectsData);
                $http.post('http://172.16.0.5:7777/test/exam/manager/saveSubject.action',addSubjectsData,{
                    headers:{
                        "Content-Type":"application/x-www-form-urlencoded"
                    }
                }).success(function (data) {
                    fun(data);
                });
            },
            checkPass:function (checkID,pass,fun) {//审核通过
                $http.get('http://172.16.0.5:7777/test/exam/manager/checkSubject.action',{
                    params:{
                        'subject.id' : checkID,
                        'subject.checkState' : pass
                    }
                }).success(function (data) {
                    fun(data);
                });
            },
            deleteSubject:function (deleteID,fun) {//删除
                $http.get('http://172.16.0.5:7777/test/exam/manager/delSubject.action',{
                    params:{
                        'subject.id':deleteID
                    }
                }).success(function(data){
                    fun(data);
                });
            }
        }
    }
});



//配置   用来配置添加subject的路径
app1.config(function ($routeProvider) {
    $routeProvider.when('/addSingleSubject',{
        templateUrl:'tpl/addSubject.html',
        controller:'addSubController'
    }).when('/AllSubject/id/:id/check/:check',{
        templateUrl:'tpl/allSubject.html',
        controller:'shcekController'
    }).when('/AllSubject/id/:id',{
        templateUrl:'tpl/allSubject.html',
        controller:'deleteController'
    });
})



//addSub.html的控制器
app1.controller('addSubController',function ($scope,allSubService,$location) {
    //添加页面中双向绑定的数据
    $scope.addSubjects = {
        typeID:1,
        levelID:1,
        departmentID:1,
        topicID:1,
        stem:'',
        answer:'',
        answerAnalysis:'',
        choiceCorrect:[],
        choiceContent:[]
    };
    //当点击'保存并继续'的时候将数据提交到后台(绑定事件)
    $scope.saveAndContinue = function () {
        //调用服务中的添加方法
        allSubService.addSubject( $scope.addSubjects,function (data) {
            alert(data);
        });
        //保存完之后将以前写入的数据置空
        $scope.addSubjects = {
            typeID:1,
            levelID:1,
            departmentID:1,
            topicID:1,
            stem:'',
            answer:'',
            answerAnalysis:'',
            choiceCorrect:[false,false,false,false],
            choiceContent:[]
        };
    };
    //保存并关闭
    $scope.saveAndClose = function () {
       allSubService.addSubject( $scope.addSubjects,function (data) {
           alert(data);
       });
        $location.path('/AllSubject/a/0/b/0/c/0/d/0');
    };
    //点击x关闭，页面调回
    $scope.close = function () {
        $location.path('/AllSubject/a/0/b/0/c/0/d/0');
    };

    //当页面一加载的时候需要的题型、等级、方向以及详细分类数据展示在页面上（调用服务中的方法）
    //方向
    allSubService.findAllType(function (data) {
        $scope.types = data;
        //console.log($scope.types);
    });
    //等级
    allSubService.findAllLevel(function (data) {
        $scope.levels = data;
    });
    //方向
    allSubService.findAllDepartment(function (data) {
        $scope.departmentes = data;
    });
    //分类
    allSubService.findAllTopics(function (data) {
        $scope.topics = data;
    });
});



//当点击方向里面的webUI的时候，知识点里面对应的webUI的知识点才显示出来
//过滤器
app1.filter('selectTopic',function () {
    return function (topics,depID) {
       //console.log(topics);
        if(topics){
            var arr = topics.filter(function (item) {
                return item.department.id == depID;
            });
            //console.log(arr);
            return arr;
        }
    }
});



//处理单选和多选(自定义指令)
app1.directive('choiceHandler',function () {
    return {
        link:function (scope,element) {
         // console.log(scope.addSubjects);
         // console.log(element.attr('type'));//object[]
            //判断一下是否是单选
            if(element.attr('type') == 'radio'){
              //  scope.addSubjects.choiceCorrect = [false,false,false,false];
                element.on('change',function (event) {
                    //console.log(this);
                    var value = $(this).attr('value');
                   // console.log(value);
                    for(var i=0;i<4;i++){
                        if(value == i){
                            scope.addSubjects.choiceCorrect[i] = true;
                        }else{
                            scope.addSubjects.choiceCorrect[i] = false;
                        }
                    }
                   scope.$digest();
                });
            }else if(element.attr('type') == 'checkbox'){
              //  scope.addSubjects.choiceCorrect = [false,false,false,false];
                element.on('change',function (event) {
                    //console.log(this);
                    var value = $(this).attr('value');
                    //console.log(value);
                    if($(this).prop('checked')){
                        for(var i=0;i<4;i++){
                            if(value == i){
                                scope.addSubjects.choiceCorrect[i] = true;
                            }
                        }
                    }else{
                       for(var i=0;i<4;i++){
                           scope.addSubjects.choiceCorrect[i] = false;
                       }
                    }scope.$digest();

                });
            }
        }
    }
});
//审核是否通过
app1.controller('shcekController',function ($routeParams,allSubService,$location) {
    console.log($routeParams.id);
    console.log($routeParams.check);
    //调用服务中的方法
    allSubService.checkPass($routeParams.id,$routeParams.check,function (data) {//审核是否通过
        alert(data);
        $location.path('/AllSubject/a/0/b/0/c/0/d/0');
    });
});
//删除
app1.controller('deleteController',function ($routeParams,allSubService,$location) {
    console.log($routeParams);
    //调用删除的方法
    allSubService.deleteSubject($routeParams.id,function (data) {
        alert(data);
        $location.path('/AllSubject/a/0/b/0/c/0/d/0');
    })
});

//定义一个指令来清除上一次选择到的
//你选择单选添加一半之后点击多选，要清除掉之前添加的内容
app1.directive('removeSub',function () {
    return {
        link:function (scope,element) {
           /* console.log(scope);
            console.log(scope.addSubjects);
            console.log(element);*/
            element.on('change',function (event) {
                console.log(this);
                scope.addSubjects.stem = '';
                scope.addSubjects.answer = '';
                scope.addSubjects.answerAnalysis = '';
                scope.addSubjects.choiceCorrect = [false,false,false,false];
                scope.addSubjects.choiceContent = [];
                scope.$digest();
            });
        }
    }
});