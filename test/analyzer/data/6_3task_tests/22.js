const APIURL = 'https://api1.blavity.com/v1/';
const CLOUDINARY_IMAGE_PATH = 'https://res.cloudinary.com/blavity/image/upload/';
var WPSITEURL = 'http://legacy.blavity.com';
var adminRole = ['57db549862e4711c9dd1eed7', '57db549862e4711c9dd1eed6'];
var roleList = ['57db5b2762e4711c9dd1eedb', '57db549862e4711c9dd1eed7', '57db549862e4711c9dd1eed6'];
var editorRole = adminRole.concat(['57db549862e4711c9dd1eed8']);
var app = angular.module('StaticRealtimeBlog', ['ngAnimate', 'ngCookies', 'ngSanitize', 'angulike', 'angular-loading-bar', 'ui.select2', 'slugifier', 'ngReadingTime', 'facebook', 'ngDialog', 'ngLodash', 'angular-jwplayer', 'ngStorage', 'toastr', 'ADM-dateTimePicker', 'angularLazyImg', 'angularMoment', 'ui.calendar', 'angular-timeline', 'mgo-angular-wizard', 'timer', 'ngCapsLock'])
    .run([
        '$rootScope', '$cookies', 'apiRequest', '$sce', 'permissions', '$window',
        function($rootScope, $localStorage, apiRequest, $sce, permissions, $window) {
            $rootScope.facebookAppId = '567482886746994'; // prod facebook app id here
            // $rootScope.facebookAppId = '631999480295334'; // dev facebook app id here
            $rootScope.exampleDate = moment().hour(8).minute(0).second(0).toDate();
            $rootScope.user = '';
            $rootScope.showUiPopup = false;
            $rootScope.accessToken = undefined;
            $rootScope.isLogin = false;
            $rootScope.loader = false;
            $rootScope.userNotAccess = true;
            $rootScope.visibleRole = [
                'superadmin',
                'administrator',
                'editor',
                'author',
                'subscriber',
                'contributor'
            ];
            $rootScope.isUserLogin = apiRequest.isUserLogin;
            $rootScope.TrustDangerousSnippet = function(post) {
                var myReg = /\[.+\]/g;
                post = post.split('https://blavity.com').join(WPSITEURL);
                post = post.split('http://blavity.com').join(WPSITEURL);;
                var sortcode = post.match(/((\[)+[\w|\s|\d|\=|\;|\&|\"]+(\]))+[\w|\s|\d|\=|\;|\&|\:|\.|\-|\"|\'|\/|\<|\>|\"|\0|\?|\*|\_|\+|\,|\Ã©]+((\[\/+([a-z,A-Z,0-9])+\]))+/g);
                var mainresponce = post;
                if (sortcode !== null) {
                    sortcode.forEach(function(element) {
                        var el = element;
                        element = element.replace(/((\[)+[\w|\s|\d|\=|\;|\&|\"]+(\]))+/g, '');
                        element = element.replace(/((\[\/+([a-z,A-Z,0-9])+\]))/g, '');
                        mainresponce = mainresponce.replace(el, element);
                    });
                }
                return $sce.trustAsHtml(mainresponce);
            };

            $rootScope.isLogin = apiRequest.isUserLogin();
            $rootScope.logout = apiRequest.logout;
            $rootScope.getUserInfo = function() {
                $rootScope.isLogin = false;
                if ($localStorage.token !== undefined || $rootScope.accessToken !== undefined) {
                    $rootScope.user = apiRequest.getUserInfo();
                    $rootScope.isLogin = apiRequest.isUserLogin();

                } else {
                    $rootScope.isLogin = false;
                }

            };
            $rootScope.$watch('user', function() {
                if ($rootScope.user) {
                    if ($rootScope.user._role) {
                        permissions.setPermissions(roleList);
                        $rootScope.$broadcast('permissionsChanged');
                    }
                }
            }, true);
            $rootScope.POSTSTATUS = {
                'isComplete': {
                    name: 'Unsaved',
                    class: 'bg-purple'
                },
                'draft': {
                    name: 'Draft',
                    class: 'bg-gray'
                },
                'submited': {
                    name: 'Post in review',
                    class: 'bg-blue'
                },
                'publish': {
                    name: 'Publish',
                    class: 'bg-green'
                },
                'trash': {
                    name: 'Removed',
                    class: 'bg-red'
                },
                'rejected': {
                    name: 'Rejected',
                    class: 'bg-orange'
                },
                'scheduled': {
                    name: 'Scheduled',
                    class: 'bg-aqua'
                },
                'private': {
                    name: 'Private',
                    class: 'bg-black'
                },
                'pending': {
                    name: 'Pending',
                    class: 'bg-yellow'
                },
                'future': {
                    name: 'Future',
                    class: 'bg-maroon'
                }
            };

            function checkMobileView() {
                $rootScope.isMobileView = !($window.innerWidth > 767);
            }

            checkMobileView();
            angular.element(window).bind('resize', function() {
                checkMobileView();
            });

            $rootScope.toogleMenu = function($event) {
                if ($event) {
                    var el = $event.currentTarget;
                    angular.element(document).find(el).toggleClass('open');
                    angular.element(document).find(el).next('.list-reset').slideToggle();
                    angular.element(document).find(el).next('.list-reset').addClass('mobile-nav');
                    if (!$rootScope.isMobileView) {
                        angular.element(document).find(el).next('.list-reset').removeClass('mobile-nav').show();
                        angular.element(document).find(el).removeClass('open');
                        angular.element(document).find('.list-reset').removeClass('mobile-nav-top').show();

                    }
                }
            };
            $rootScope.toogleMenu();

            $rootScope._isMobile = (function() {
                var check = false;
                (function(a) {
                    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true
                })(navigator.userAgent || navigator.vendor || window.opera);
                return check;
            })();

            $rootScope.isIOS = (function() {
                var iDevices = [
                    'iPad Simulator',
                    'iPhone Simulator',
                    'iPod Simulator',
                    'iPad',
                    'iPhone',
                    'iPod'
                ];

                if (!!navigator.platform) {
                    while (iDevices.length) {
                        if (navigator.platform === iDevices.pop()) {
                            return true;
                        }
                    }
                }

                return false;
            })();


        } //end app.run
    ])
    .config(['FacebookProvider', function(FacebookProvider) {
        //todo change this with live facebook app id (567482886746994)
        //FacebookProvider.init('1823616114539653');
        FacebookProvider.init('567482886746994');

    }])
    .config(['lazyImgConfigProvider', function(lazyImgConfigProvider) {
        lazyImgConfigProvider.setOptions({
            offset: 100, // how early you want to load image (default = 100)
            errorClass: 'error', // in case of loading image failure what class should be added (default = null)
            successClass: 'success', // in case of loading image success what class should be added (default = null)
            onError: function(image) {}, // function fired on loading error
            onSuccess: function(image) {
                image.$elem.removeClass('lazy-spinner');
            }, // function fired on loading success
        });
    }])
    .config(['$logProvider', function($logProvider) {
        $logProvider.debugEnabled(true);
    }])
    .config(['ADMdtpProvider', function(ADMdtp) {
        ADMdtp.setOptions({
            calType: 'gregorian',
            format: 'YYYY/MM/DD hh:mm',
            default: 'today',

        })
    }])
    .config(['$compileProvider', function($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|sms):/);

    }])
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push(function($q, $location, $localStorage) {
            return {
                response: function(response) {
                    // do something on success

                    if (response.data) {
                        if (response.data.token) {
                            if (response.data.success === true) {

                                $localStorage.token = response.data.token;
                                $localStorage.user = response.data.user;


                            }
                        } //end if response has token
                    } //end if response has data

                    return response;
                },
                responseError: function(response) {
                    if (response.status === 401) {}


                    return $q.reject(response);
                }

            };

        });

    }])
    .filter('unsafe', ['$sce', function($sce) {
        return function(val) {
            return $sce.trustAsHtml(val);
        };
    }])
    .filter('unique', function() {
        return function(collection, keyname) {
            var output = [],
                keys = [];

            angular.forEach(collection, function(item) {
                var key = item[keyname];
                if (keys.indexOf(key) === -1) {
                    keys.push(key);
                    output.push(item);
                }
            });

            return output;
        };
    })
    .filter('encodeURIComponent', function() {
        return function(text) {
            return encodeURIComponent(text)
        };
    })
    .filter('fetchimage', function() {
        return function(userdata) {
            if (userdata === undefined || userdata === '' || userdata === null) {
                return 'https://www.gravatar.com/avatar/9e4f2f7f4496c1c74ce6ef30b5fcab70';
            } else if (userdata.profileImagePreference === 'fbgravatar') {
                return userdata.fbUserPicture;
            } else if (userdata.profileImagePreference === 'gravatar' || userdata.profileImagePreference === '') {
                var hash = '';
                if (userdata.email.length) {
                    hash = md5(userdata.email);
                }
                return 'https://www.gravatar.com/avatar/' + hash;
            } else {
                return userdata.profileImagePreference;
            }
        };
    })
    .filter('htmlToPlaintext', function() {
        return function(text) {
            //remove html characters
            text = text ? String(text).replace(/<[^>]+>/gm, '') : '';
            //remove wordpress shortcodes as well
            return text.replace(/\[(\S+)[^\]]*][^\[]*\[\/\1\]/g, '');
        };
    })
    .filter('escapeHtml', function() {
        return function(text) {
            var entityMap = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': '&quot;',
                "'": '&#39;',
                "/": '&#x2F;'
            };

            return text.replace(/[&<>"'\/]/g, function(s) {
                return entityMap[s];
            });
        };
    })
    .filter('replaceImgUrl', function() {
        return function(text) {
            //remove html characters
            if (text !== undefined) {
                if (text.length > 2) {
                    if (text.indexOf('https://blavity.com') !== -1) {
                        text = text.replace('https://blavity.com', 'http://legacy.blavity.com');
                    }
                    if (text.indexOf('http://blavity.com') !== -1) {
                        text = text.replace('http://blavity.com', 'http://legacy.blavity.com');
                    }
                    return text;
                } else {
                    return '';
                }
            }
        }
    })
    .filter('replaceImgUrlSocialShare', function() {
        return function(text) {
            //remove html characters
            if (text !== undefined) {
                if (text.length > 2) {
                    if (text.indexOf('https://blavity.com') !== -1) {
                        text = text.replace('https://blavity.com', 'http://legacy.blavity.com');
                    } else if (text.indexOf('http') == -1) {
                        var types = text.split('/');
                        if (types.length > 1) {
                            text = CLOUDINARY_IMAGE_PATH + text;
                        } else {
                            text = 'https://s3.amazonaws.com/blavitymedia/images/' + text;
                        }
                    }
                    return text;
                } else {
                    return '';
                }
            }
        }
    })
    .filter('truncatePostContent', function() {
        return function(content, maxLength) {
            var trimmedString = content ? String(content).replace(/<[^>]+>/gm, '') : ''; //remove html tags from string
            if (trimmedString.length <= maxLength) {
                return trimmedString;
            }
            trimmedString = trimmedString.substr(0, maxLength);
            while (trimmedString.charAt(trimmedString.length - 1) === ' ') {
                trimmedString = trimmedString.substr(0, trimmedString.length - 1);
            }
            return trimmedString + '...';
        };
    })
    .filter('embedvideo', function() {
        return function(content) {
            if (content.includes('://youtu') || content.includes('://www.youtu')) {
                content = content.replace('watch?v=', 'v/');
                var v = content.split('/');
                return v[0] + '//youtube.com/v/' + v[v.length - 1];
            } else {
                return content;
            }

        };
    })
    .filter('linkify', function() {
        return function(text) {
            if (text && typeof text === "string") {
                text = text.split('https://blavity.com').join(WPSITEURL);
                text = text.split('http://blavity.com').join(WPSITEURL);
                var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
                return text.replace(urlRegex, function(url) {
                    return '<a href="' + url + '">' + url + '</a>';
                });
            } //end if
            else {
                return '';
            }
        };
    })
    .filter('hash', function() {
        return function(val) {
            if (typeof val === 'undefined' || val.trim() === '')
                return '';

            return md5(val);
        };
    })
    .filter('timeago', function() {
        return function(input, p_allowFuture) {


            var substitute = function(stringOrFunction, number, strings) {
                    var string = angular.isFunction(stringOrFunction) ? stringOrFunction(number, dateDifference) : stringOrFunction;
                    var value = (strings.numbers && strings.numbers[number]) || number;
                    return string.replace(/%d/i, value);
                },
                nowTime = (new Date()).getTime(),
                date = (new Date(input)).getTime(),

                allowFuture = p_allowFuture || false,
                strings = {
                    prefixAgo: '',
                    prefixFromNow: '',
                    suffixAgo: 'ago',
                    suffixFromNow: 'from now',
                    seconds: 'less than a minute',
                    minute: 'about a minute',
                    minutes: '%d minutes',
                    hour: 'about an hour',
                    hours: 'about %d hours',
                    day: 'a day',
                    days: '%d days',
                    month: 'about a month',
                    months: '%d months',
                    year: 'about a year',
                    years: '%d years'
                },
                dateDifference = nowTime - date,
                words,
                seconds = Math.abs(dateDifference) / 1000,
                minutes = seconds / 60,
                hours = minutes / 60,
                days = hours / 24,
                years = days / 365,
                separator = strings.wordSeparator === undefined ? ' ' : strings.wordSeparator,


                prefix = strings.prefixAgo,
                suffix = strings.suffixAgo;

            if (allowFuture) {
                if (dateDifference < 0) {
                    prefix = strings.prefixFromNow;
                    suffix = strings.suffixFromNow;
                }
            }

            words = seconds < 45 && substitute(strings.seconds, Math.round(seconds), strings) ||
                seconds < 90 && substitute(strings.minute, 1, strings) ||
                minutes < 45 && substitute(strings.minutes, Math.round(minutes), strings) ||
                minutes < 90 && substitute(strings.hour, 1, strings) ||
                hours < 24 && substitute(strings.hours, Math.round(hours), strings) ||
                hours < 42 && substitute(strings.day, 1, strings) ||
                days < 30 && substitute(strings.days, Math.round(days), strings) ||
                days < 45 && substitute(strings.month, 1, strings) ||
                days < 365 && substitute(strings.months, Math.round(days / 30), strings) ||
                years < 1.5 && substitute(strings.year, 1, strings) ||
                substitute(strings.years, Math.round(years), strings);

            prefix.replace(/ /g, '');
            words.replace(/ /g, '');
            suffix.replace(/ /g, '');
            return (prefix + ' ' + words + ' ' + suffix + ' ' + separator);

        };
    })
    .filter('articeltimeago', function() {
        return function(article) {
            if (!article) {
                return;
            }
            var input = article.updatedAt;
            if (article.publish_on && article.publish_on !== undefined) {
                input = article.publish_on;
                if (moment(article.updatedAt).diff(article.publish_on) < 1) {
                    input = article.updatedAt;
                }
            }
            return moment(input).fromNow();
        };
    })
    .filter('urlSlug', function() {
        return function(val) {
            if (val) {
                var slug = val.toLowerCase().replace(/\s+/g, '-'); //replace spaces with dashes
                //remove any other weird characters with
                return slug.replace(/[^a-zA-Z0-9-_]/g, '');
            } //end if
            else {
                return false;
            }

        };
    })
    .filter('truncateWords', [
        function() {
            return function(input, words) {

                if (isNaN(words)) return input;
                if (words <= 0) return '';
                if (input) {
                    var inputWords = input.split(/\s+/);
                    if (inputWords.length > words) {
                        input = inputWords.slice(0, words).join(' ') + '...';
                    }
                }
                return input;

            };
        }
    ])
    .filter('jsonparse', [
        function() {
            return function(data) {

                if (!data || typeof data !== 'object') {
                    return;
                }
                return JSON.parse(data);
            };
        }
    ])
    .filter('getuserdisplayname', function() {
        return function(user) {

            if (!user) {
                return "BlavityFam";
            }

            if (!user.display_name) {
                return user.username;
            } //end if
            else {
                return user.display_name;
            }
        };
    })
    .filter('filterAwsImage', function() {
        return function(userdata) {
            var imagePath = '';
            if (userdata === undefined || userdata === '' || userdata === null) {
                imagePath = 'https://www.gravatar.com/avatar/9e4f2f7f4496c1c74ce6ef30b5fcab70';
            } else if (userdata.profileImagePreference === 'fbgravatar') {
                imagePath = userdata.fbUserPicture;
            } else if (userdata.profileImagePreference === 'gravatar' || userdata.profileImagePreference === '') {
                var hash = '';
                if (userdata.email.length) {
                    hash = md5(userdata.email);
                }
                imagePath = 'https://www.gravatar.com/avatar/' + hash;
            } else {
                imagePath = userdata.profileImagePreference;
            }

            if (imagePath) {
                if (imagePath !== undefined && imagePath !== '' && imagePath.indexOf('http') === -1) {
                    var types = imagePath.split('/');
                    if (types.length > 1) {
                        imagePath = CLOUDINARY_IMAGE_PATH + imagePath;
                    } else {
                        imagePath = 'https://s3.amazonaws.com/blavitymedia/images/' + imagePath;
                    }
                }
            }
            if (!imagePath) {
                imagePath = '/images/ImageFound.png';
            }
            return imagePath;
        };
    })
    .filter('filterAwsFeatureImage', ['featuredImageService', function(featuredImageService) {
        return function(articles, type) {
            if (!articles) {
                return;
            }
            var medias = featuredImageService.getFeatureImage(articles._medias);
            var isMedia = true;
            var imagePath = articles.wp_featuredImage;
            if (articles._featuredImage) {
                isMedia = false;
                imagePath = WPSITEURL + articles._featuredImage
            }
            if (isMedia && imagePath) {
                if (imagePath !== undefined && imagePath !== '' && imagePath.indexOf('http') === -1) {
                    var types = imagePath.split('/');
                    if (types.length > 1) {
                        imagePath = CLOUDINARY_IMAGE_PATH + imagePath;
                    } else if ((!type && imagePath.indexOf('.gif') !== -1) || !type) {
                        imagePath = 'https://s3.amazonaws.com/blavitymedia/images/' + imagePath;
                    } else {
                        imagePath = 'https://s3.amazonaws.com/blavitymedia/images/' + type + '/' + imagePath;
                    }
                } else {
                    imagePath = imagePath.split('https://blavity.com').join(WPSITEURL);
                    imagePath = imagePath.split('http://blavity.com').join(WPSITEURL);
                }
            }
            if (!imagePath) {
                imagePath = '/images/ImageFound.png';
            } // console.log(imagePath)
            return imagePath;
        };
    }])
    .filter('hasAdminPermission', ['$rootScope', function($rootScope) {
        return function(type) {
            var permission = $rootScope.user._role || '';
            if (permission && $rootScope.user._role._id !== undefined) {
                permission = $rootScope.user._role._id || '';
            }
            return adminRole.indexOf(permission) >= 0;
        }
    }])
    .filter('hasEditPermission', ['$rootScope', function($rootScope) {
        return function(type) {
            var permission = $rootScope.user._role || '';
            if (permission && $rootScope.user._role._id !== undefined) {
                permission = $rootScope.user._role._id || '';
            }
            return roleList.indexOf(permission) >= 0;
        }
    }])
    .factory('Utils', ['$q', function($q) {
        return {
            isImage: function(src) {

                var deferred = $q.defer();

                var image = new Image();
                image.onerror = function() {
                    deferred.resolve(false);
                };
                image.onload = function() {
                    deferred.resolve(true);
                };
                image.src = src;

                return deferred.promise;
            }
        };
    }])
    .factory('permissions', ['$rootScope', 'apiRequest', function($rootScope, apiRequest) {
        var permissionList = [];
        return {
            setPermissions: function(permissions) {
                permissionList = permissions;
                $rootScope.$broadcast('permissionsChanged');
            },
            hasPermission: function(permission) {
                if ($rootScope.user) {
                    if ($rootScope.user._role) {
                        permission = $rootScope.user._role || '';
                        if ($rootScope.user._role._id) {
                            permission = $rootScope.user._role._id || '';
                        }
                    }
                    if (permissionList.indexOf(permission) >= 0) {
                        $rootScope.userNotAccess = true;
                        return true;
                    } else {
                        $rootScope.userNotAccess = false;
                        return false;
                    }
                }
            },
            hasEditPermission: function() {

                $rootScope.user = apiRequest.getUserInfo();
                var permission = '';
                if ($rootScope.user) {
                    permission = $rootScope.user._role || '';
                    if (permission && $rootScope.user._role._id) {
                        permission = $rootScope.user._role._id || '';
                    }
                }
                return roleList.indexOf(permission) >= 0;
            },
            hasEditorPermission: function() {
                $rootScope.user = apiRequest.getUserInfo();
                var permission = '';
                if ($rootScope.user) {
                    permission = $rootScope.user._role || '';
                    if (permission && $rootScope.user._role._id) {
                        permission = $rootScope.user._role._id || '';
                    }
                }
                return editorRole.indexOf(permission) >= 0;
            }
        };
    }])
    .factory('Utilscheckimage', ['$q', function($q) { //factory for check image found or not
        return {
            isImage: function(src) {

                var deferred = $q.defer();

                var image = new Image();
                image.onerror = function() {
                    deferred.resolve(false);
                };
                image.onload = function() {
                    deferred.resolve(true);
                };
                image.src = src;

                return deferred.promise;
            }
        };
    }])
    .service('featuredImageService', function() {
        this.getFeatureImage = function(media) {
            if (media === null || media === '' || media === undefined) {
                return '';
            } else {
                var key = _.findKey(media, ['is_featured_image', true]);
                return media[key];
            }
        }
    })
    .service('figCaptionService', function() {
        this.addFigCaption = function(articleBody) {
            return articleBody.replace(/<img\s+[^>]*alt="([^"]*)"[^>]*>/g, function(match, p1) {
                return '<figure>' + match + '<figcaption class="body-figure-caption px1">' + p1 + '</figcaption></figure>';
            });
        };
    })
    .service('selectService', ['$http', function($http) {
        this.getPostByType = function(type, offset, limit, query, author) {
            return $http.get(APIURL + 'articles/status/' + type + '/' + query + '/' + limit + '/' + offset, {
                headers: {
                    "Author": author
                }
            })
        };

        this.getCategory = function() {
            return $http.get(APIURL + 'category/100');
        };

        this.getTags = function() {
            return $http.get(APIURL + 'tags/500');
        };
    }])
    .service('deleteServices', ['$http', '$localStorage', function($http, $localStorage) {
        this.deletePost = function(_id) {
            return $http({
                method: 'DELETE',
                url: APIURL + 'articles/' + _id,
                headers: {
                    'Content-Type': undefined,
                    'token': $localStorage.token
                },
                data: {}
            });
        };
        this.removeBlankArticles = function(_id) {
            return $http({
                method: 'DELETE',
                url: APIURL + 'removeBlankArticles/',
                headers: {
                    'Content-Type': undefined,
                    'token': $localStorage.token
                },
                data: {}
            });
        };
    }])
    .service('shareServices', ['$filter', function($filter) {
        this.shareFacebook = function(title, slug, img, truncatePostContentBody) {
            img = $filter('replaceImgUrlSocialShare')(img);
            FB.ui({
                method: 'feed',
                picture: img,
                name: title,
                description: truncatePostContentBody || 'Check out Blavity for more stuff like this',
                caption: 'Blavity.com',
                link: 'https://blavity.com/' + slug
            });
        };

        this.shareTwitter = function(title, slug, img, excerpt, truncatePostContentBody) {
            title = encodeURIComponent(title);
        };

        this.shareMail = function(title, slug, img, excerpt, truncatePostContentBody) {
            title = encodeURIComponent(title);
            window.location.href = 'mailto:?subject=Check%20Out%20This%20Blavity%20Post%20-%20' +
                title + '&body=Check out this Blavity post, https://blavity.com/' +
                slug + '';
        };
        this.shareIOS = function(title, slug, img, excerpt, truncatePostContentBody) {
            title = encodeURIComponent(title);
            window.location.href = 'sms:&body=Check out this Blavity post, https://blavity.com/' +
                slug + ' - ' + title;
        };
        this.shareAndroid = function(title, slug, img, excerpt, truncatePostContentBody) {
            title = encodeURIComponent(title);
            window.location.href = 'sms:?body=Check out this Blavity post, https://blavity.com/' +
                slug + ' - ' + title;
        };
    }])
    .service('apiRequest', ['$http', '$rootScope', '$localStorage', '$location', function($http, $rootScope, $localStorage, $location) {
        this.isUserLogin = function() {
            return !!$localStorage.token;
        };
        this.logout = function() {
            $localStorage.$reset();
            window.location.assign('/');

        };
        this.getRequest = function(url, param) {
            return $http.get(APIURL + url + param);
        };
        this.getUserInfo = function() {
            if ($localStorage.user) {
                return $localStorage.user
            } else {
                $http({
                    method: 'POST',
                    url: APIURL + 'getUserInfo',
                    headers: {
                        'Content-Type': undefined,
                        'token': $localStorage.token
                    },
                    data: {}
                }).success(function(res) {
                    $localStorage.user = res.user;
                })
            }

        };
        this.lockArticle = function(id) {
            return $http({
                method: 'POST',
                url: APIURL + 'lockArticles/' + id,
                headers: {
                    'Content-Type': undefined,
                    'token': $localStorage.token
                },
                data: {}
            })
        };
        this.UnLockArticle = function(id) {
            return $http({
                method: 'POST',
                url: APIURL + 'UnLockArticles/' + id,
                headers: {
                    'Content-Type': undefined,
                    'token': $localStorage.token
                },
                data: {}
            })
        };
        this.changeUserOfPost = function(userName, id) {
            return $http({
                method: 'GET',
                url: APIURL + 'changeUserOfPost/' + userName + '/' + id,
                headers: {
                    'Content-Type': undefined,
                    'token': $localStorage.token
                },
                data: {}
            })
        };
        this.listAllUsers = function(limit, offset, str) {
            var URL = '';
            if (str === undefined || str === '') {
                URL = APIURL + 'users/getAll/' + limit + '/' + offset;
            } else {
                URL = APIURL + 'searchUsers/' + str + '/' + limit + '/' + offset
            }
            return $http({
                method: 'GET',
                url: URL,
                headers: {
                    'Content-Type': undefined,
                    'token': $localStorage.token
                },
                data: {}
            })
        };
        this.addUsers = function(users) {
            return $http({
                method: 'POST',
                url: APIURL + 'addUsers',
                headers: {
                    'Content-Type': undefined,
                    'token': $localStorage.token
                },
                transformRequest: function(data) {
                    var formData = new FormData();
                    /*need to convert our json object to a string version of json otherwise
                     the browser will do a 'toString()' on the object which will result
                     in the value '[Object object]' on the server.*/
                    formData.append('user', angular.toJson(data.user));
                    formData.append('host', data.host);
                    return formData;
                },
                data: {
                    'user': users,
                    'host': $location.protocol() + '://' + $location.host() + ':' + $location.port()
                }
            })
        };
        this.updateUsers = function(username, users) {

            return $http({
                method: 'PUT',
                url: APIURL + 'updateUsers/' + username,
                headers: {
                    'Content-Type': undefined,
                    'token': $localStorage.token
                },
                transformRequest: function(data) {
                    var formData = new FormData();
                    /*need to convert our json object to a string version of json otherwise
                     the browser will do a 'toString()' on the object which will result
                     in the value '[Object object]' on the server.*/
                    formData.append('user', angular.toJson(data.user));
                    return formData;
                },
                data: {
                    'user': users
                }
            })
        };
        this.updateProfile = function(users) {

            return $http({
                method: 'PUT',
                url: APIURL + 'updateProfile',
                headers: {
                    'Content-Type': undefined,
                    'token': $localStorage.token
                },
                transformRequest: function(data) {
                    var formData = new FormData();
                    /*need to convert our json object to a string version of json otherwise
                     the browser will do a 'toString()' on the object which will result
                     in the value '[Object object]' on the server.*/
                    formData.append('user', angular.toJson(data.user));
                    return formData;
                },
                data: {
                    'user': users
                }
            })
        };
        this.changePassword = function(users) {

            return $http({
                method: 'PUT',
                url: APIURL + 'changePassword',
                headers: {
                    'Content-Type': undefined,
                    'token': $localStorage.token
                },
                transformRequest: function(data) {
                    var formData = new FormData();
                    /*need to convert our json object to a string version of json otherwise
                     the browser will do a 'toString()' on the object which will result
                     in the value '[Object object]' on the server.*/
                    formData.append('user', angular.toJson(data.user));
                    return formData;
                },
                data: {
                    'user': users
                }
            })
        };
        this.getUserRole = function() {
            return $http({
                method: 'GET',
                url: APIURL + 'getUserRole',
                headers: {
                    'Content-Type': undefined,
                    'token': $localStorage.token
                },
                data: {}
            });
        };
        this.getSchedulePost = function() {
            return $http({
                method: 'GET',
                url: APIURL + 'post/schedule',
                headers: {
                    'Content-Type': undefined,
                    'token': $localStorage.token
                },
                data: {}
            });
        };
        this.getRecentPost = function(limit, offset) {

            var URL = APIURL + 'recentPost/' + limit + '/' + offset;
            return $http({
                method: 'GET',
                url: URL,
                headers: {
                    'Content-Type': undefined,
                    'token': $localStorage.token
                },
                data: {}
            })
        };
        this.getArticleHistory = function(id, limit, offset) {
            var URL = APIURL + 'article-history/' + id + '/' + limit + '/' + offset;
            return $http({
                method: 'GET',
                url: URL,
                headers: {
                    'Content-Type': undefined,
                    'token': $localStorage.token
                },
                data: {}
            })
        };
        this.getAuthor = function(id, limit, offset) {
            var URL = APIURL + 'user/authorList';
            return $http({
                method: 'GET',
                url: URL,
                headers: {
                    'Content-Type': undefined,
                    'token': $localStorage.token
                },
                data: {}
            })
        };
        this.addSeries = function(series) {

            return $http({
                method: 'POST',
                url: APIURL + 'series/add',
                headers: {
                    'Content-Type': undefined,
                    'token': $localStorage.token
                },
                transformRequest: function(data) {
                    var formData = new FormData();
                    formData.append('series', data.series);
                    return formData;
                },
                data: {
                    'series': series
                }
            })
        };
        this.getSeriesList = function(limit, offset) {
            limit = limit || 1000;
            offset = offset || 0;
            return $http({
                method: 'get',
                url: APIURL + 'series/list/' + limit + '/' + offset,
                headers: {
                    'Content-Type': undefined,
                    'token': $localStorage.token
                }
            })
        };
        this.getArticleSeries = function(slug) {
            return $http({
                method: 'get',
                url: APIURL + '/article-series/' + slug,
                headers: {
                    'Content-Type': undefined,
                    'token': $localStorage.token
                }
            })
        };
        this.addPostEditorsComments = function(articleId, comment) {

            return $http({
                method: 'POST',
                url: APIURL + 'post-editors-comments/' + articleId,
                headers: {
                    'Content-Type': undefined,
                    'token': $localStorage.token
                },
                transformRequest: function(data) {
                    var formData = new FormData();
                    /*need to convert our json object to a string version of json otherwise
                     the browser will do a 'toString()' on the object which will result
                     in the value '[Object object]' on the server.*/
                    formData.append('comment', angular.toJson(data.comment));
                    return formData;
                },
                data: {
                    'comment': comment
                }
            })
        };
        this.getPostEditorsComments = function(articleId, limit, offset) {
            limit = limit || 10;
            return $http({
                method: 'GET',
                url: APIURL + 'post-editors-comments/' + articleId + '/' + limit + '/' + offset || 0,
                headers: {
                    'Content-Type': undefined,
                    'token': $localStorage.token
                }
            })
        };
        this.getPendingPost = function(limit, offset, author, searchText) {
            limit = limit || 10;
            return $http({
                method: 'GET',
                url: APIURL + 'articles/pending-post/' + limit + '/' + offset || 0,
                headers: {
                    'Content-Type': undefined,
                    'token': $localStorage.token,
                    'Author': author,
                    'Search': searchText
                }
            })
        };
        this.toggleFacebookAutoPost = function(isAutoPost) {
            return $http({
                method: 'PUT',
                url: APIURL + 'autoSchedule/' + isAutoPost,
                headers: {
                    'Content-Type': undefined,
                    'token': $localStorage.token
                }
            })
        };
        this.getBlankArticle = function() {
            return $http({
                method: 'GET',
                url: APIURL + 'blankarticles',
                headers: {
                    'Content-Type': undefined
                }
            });
        };
        this.getTopJwPlayerVideo = function(limit, offset) {
            return $http({
                method: 'GET',
                url: APIURL + 'videos/top/' + limit + '/' + offset,
                headers: {
                    'Content-Type': undefined,
                    'token': $localStorage.token
                }
            })
        };
        this.addSubscriber = function(email, name) {
            var users = {
                email: email,
                name: name
            };
            return $http({
                method: 'POST',
                url: 'https://api.blavity.io/subscribers/blavity?list=blavityDaily',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: {
                    'email': email,
                    'name': name
                }
            })
        };

    }])
    .service('roleAuth', ['$http', '$rootScope', '$localStorage', function($http, $rootScope, $localStorage) {

        this.isHasPostApprovalRole = function(param) {
            var role = ['author', 'superadmin', 'administrator'];
            return (role.indexOf(param) >= 0);
        };
        this.getUserInfo = function() {
            return $http({
                method: 'POST',
                url: APIURL + 'getUserInfo',
                headers: {
                    'Content-Type': undefined,
                    'token': $localStorage.token
                },
                data: {}
            });
        };
    }])
    .service('dialogUI', ['ngDialog', function(ngDialog) {
        this.confirmUI = function(title, msg, sucessCb, errorCB) {
            ngDialog.open({
                template: '../tmpl/confirmUI.html',
                className: 'ngdialog-theme-popup',
                controller: ['$scope', function($scope) {
                    $scope.title = title || 'confirmation';
                    $scope.msg = msg || 'Are you sure?';
                    $scope.success = function() {
                        sucessCb();
                        $scope.closeThisDialog(1);
                    };

                    $scope.cancel = function() {
                        errorCB();
                        $scope.closeThisDialog(1);
                    };

                }]
            });
        };
    }])
    .service('outOfPage1x1AdService', function() {
        this.insert = function(body) {
            let adUnitId = new Date().getTime();
            let adUnit = '<!-- /11462305847/bla --><div class="clearfix center-align center mx-auto"><div id="div-gpt-ad-1538162248000-' + adUnitId + '"></div></div><script>AdBridg.cmd.push(function() { AdBridg.defineSlot("/11462305847/bla", [[1, 1]], "div-gpt-ad-1538162248000-' + adUnitId + '"); }); AdBridg.cmd.push(function() { AdBridg.display("div-gpt-ad-1538162248000-' + adUnitId + '"); });</script>';
            let bodyWithAd = body;
            let sortcode = /<p\b[\s\S]*?<\/p>/g;
            let paragraphs = body.match(sortcode) || [];

            if (paragraphs.length < 4) {
                return body;
            }

            return bodyWithAd.replace(paragraphs[1], paragraphs[1] + adUnit);
        };
    })
    .directive('hasPermission', ['permissions', function(permissions) {
        return {
            restrict: 'AEC',
            link: function(scope, element, attrs) {
                if (!_.isString(attrs.hasPermission)) {
                    throw 'hasPermission value must be a string';
                }
                var value = attrs.hasPermission.trim();
                var notPermissionFlag = value[0] === '!';
                if (notPermissionFlag) {
                    value = value.slice(1).trim();
                }

                function toggleVisibilityBasedOnPermission() {
                    var hasPermission = permissions.hasPermission(value);
                    if (hasPermission && !notPermissionFlag || !hasPermission && notPermissionFlag) {
                        element.show();
                    } else {
                        element.hide();
                    }
                }

                toggleVisibilityBasedOnPermission();
                scope.$on('permissionsChanged', toggleVisibilityBasedOnPermission);
            }
        };
    }])
    .directive('hasAdminPermission', ['$rootScope', function($rootScope) {
        return {
            restrict: 'AEC',
            link: function(scope, element, attrs) {
                if (!_.isString(attrs.hasAdminPermission)) {
                    throw 'hasPermission value must be a string';
                }
                var value = attrs.hasAdminPermission.trim();
                var notPermissionFlag = value[0] === '!';
                if (notPermissionFlag) {
                    value = value.slice(1).trim();
                }

                function toggleVisibilityBasedOnPermission() {
                    var permission = $rootScope.user._role || '';
                    if (permission && $rootScope.user._role._id !== undefined) {
                        permission = $rootScope.user._role._id || '';
                    }
                    if (adminRole.indexOf(permission) >= 0) {
                        element.show();
                    } else {
                        element.hide();
                    }
                }

                toggleVisibilityBasedOnPermission();
                scope.$on('permissionsChanged', toggleVisibilityBasedOnPermission);
            }
        };
    }])
    .directive('hasEditorPermission', ['$rootScope', 'permissions', function($rootScope, permissions) {
        return {
            restrict: 'AEC',
            link: function(scope, element, attrs) {
                function toggleVisibilityBasedOnPermission() {
                    if (permissions.hasEditorPermission()) {
                        element.show();
                    } else {
                        element.hide();
                    }
                }
                toggleVisibilityBasedOnPermission();
                scope.$on('permissionsChanged', toggleVisibilityBasedOnPermission);
            }
        };
    }])
    .directive('fileUpload', function() {
        return {
            scope: true, //create a new scope
            link: function(scope, el, attrs) {
                el.bind('change', function(event) {
                    var files = event.target.files;
                    //iterate files since 'multiple' may be specified on the element
                    for (var i = 0; i < files.length; i++) {
                        //emit event upward
                        scope.$emit('fileSelected', {
                            file: files[i]
                        });
                    }
                });
            }
        };
    })
    //Image cache and AWS image filter directive
    .directive('filterAwsImage', ["Utilscheckimage", function(Utilscheckimage) {
        return {
            restrict: 'E',
            template: '<img class="{{class}}" src="https://dummyimage.com/600x400/000/fff&text=loading" lazy-img="{{path}}" title="{{title}}" alt="{{alt}}"/>',

            scope: true,
            replace: true,
            link: function(scope, element, attrs) {
                attrs.$observe('path', function(newTime) {
                    var imagePath = attrs.path;
                    var filterSize = false;
                    scope.title = '';
                    scope.alt = '';
                    if (attrs.type !== undefined && attrs.type !== '') {
                        filterSize = true;
                    }

                    if (attrs.attribute !== '' && attrs.attribute !== undefined) {
                        var data = JSON.parse(attrs.attribute);
                        scope.title = data.title;
                        scope.alt = data.alt;
                    }
                    if (imagePath !== undefined && imagePath !== '' && imagePath.indexOf('http') === -1) {
                        var types = imagePath.split('/');
                        if (types.length > 1) {
                            scope.path = CLOUDINARY_IMAGE_PATH + 'c_crop,g_center,w_auto,q_auto:best,f_auto/l_text:Verdana_10:Blavity,g_south_east,x_0/' + imagePath;
                        } else if ((!filterSize && imagePath.indexOf('.gif') !== -1) || !filterSize) {
                            scope.path = 'https://s3.amazonaws.com/blavitymedia/images/' + imagePath;
                        } else {
                            scope.path = 'https://s3.amazonaws.com/blavitymedia/images/' + attrs.type + '/' + imagePath;
                        }
                    } else {
                        var post = attrs.path.split('http://blavity.com').join(WPSITEURL);
                        scope.path = post;
                    }
                    Utilscheckimage.isImage(scope.path).then(function(result) { //checks image found or not in factory
                        if (result === false) {
                            scope.path = "/images/ImageFound.png";
                        }
                    });
                    scope.class = attrs.class;
                });

            }

        }
    }])
    //Image cache and AWS Feature image filter directive
    .directive('filterAwsFeatureImage', ['Utilscheckimage', 'featuredImageService', function(Utilscheckimage, featuredImageService) {
        return {
            restrict: 'E',
            template: '<p class="relative"><img class="{{class}} {{id}}" src="/images/loading.png" lazy-img="{{path}}" title="{{title}}" alt="{{alt}}"/><span ng-if="showcaptions" class="post-figure-caption px1">{{ alt }}</span></p>',

            scope: true,
            replace: true,
            link: function(scope, element, attrs) {
                attrs.$observe('articles', function(newTime) {
                    scope.showcaptions = attrs.showcaption == "true" ? true : false;
                    scope.class = attrs.class;
                    scope.id = attrs.id || '';
                    var articles = JSON.parse(attrs.articles);
                    scope.id = scope.id ? scope.id : articles._id;
                    var medias = featuredImageService.getFeatureImage(articles._medias);
                    scope.title = articles.title;
                    scope.alt = articles.featureImagesCaption ? articles.featureImagesCaption : '';
                    var isMedia = true;
                    var imagePath = articles.wp_featuredImage;
                    if (medias !== '' && medias !== undefined) {
                        imagePath = medias.url;
                        scope.title = medias.title;
                        scope.alt = medias.caption;
                    } else if (articles._featuredImage) {
                        isMedia = false;
                        scope.path = WPSITEURL + articles._featuredImage
                    }
                    if (isMedia && imagePath) {

                        var type = attrs.type;
                        if (imagePath !== undefined && imagePath !== '' && imagePath.indexOf('http') === -1) {
                            var ext = imagePath.split('/');
                            if (ext.length > 1) {
                                scope.path = CLOUDINARY_IMAGE_PATH + 'c_crop,g_center,w_auto,q_auto:best,g_south_east,x_0/' + imagePath; //per Olympic Committe request
                                // scope.path = CLOUDINARY_IMAGE_PATH + 'c_crop,g_center,w_auto,q_auto:best,f_auto/l_text:Verdana_10:Blavity,g_south_east,x_0/' + imagePath;
                            } else if ((!type && imagePath.indexOf('.gif') !== -1) || !type) {
                                scope.path = 'https://s3.amazonaws.com/blavitymedia/images/' + imagePath;
                            } else {
                                scope.path = 'https://s3.amazonaws.com/blavitymedia/images/' + type + '/' + imagePath;
                            }
                        } else {
                            scope.path = imagePath.split('https://blavity.com').join(WPSITEURL);
                            scope.path = imagePath.split('http://blavity.com').join(WPSITEURL);
                        }
                    }
                    Utilscheckimage.isImage(scope.path).then(function(result) { //checks image found or not in factory
                        if (result === false) {
                            scope.path = "/images/ImageFound.png";
                        }
                    });
                });

            }

        }
    }])
    .controller('subscriberCtrl', ['$scope', function($scope) {
        $scope.EMAIL = '';
        $scope.HASH = md5($scope.EMAIL);
        $scope.createHash = function(event) {
            angular.element(document).find('#MERGE5').val(md5(angular.element(event.target).val()))
        }
    }]);



/*JAVASCRIPT CODE*/
$('#main-hider').fadeOut('slow');

//Check to see if the window is top if not then display button
let topUrl = '';
let topTitle = '';
let topArticleFlag = 0;
//Check to see if the window is top if not then display button
$(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
        $('.scroll_top').fadeIn();
    } else {
        $('.scroll_top').fadeOut();
    }

    // var objectItem = $("div[id^='scrollMarker_']");
    // if (objectItem.length > 0) {
    //     if (window.pageYOffset <= topArticleFlag){
    //         document.title = topTitle;
    //         window.history.pushState('', topTitle, topUrl);
    //     }else{
    //         $.each(objectItem, function (key, obj) {
    //             if ($(obj).isOnScreen()) {
    //                 if (topUrl=='' && topTitle == '' && topArticleFlag == 0){
    //                     topUrl = location.pathname;
    //                     topTitle = document.title;
    //                     topArticleFlag = window.pageYOffset;
    //                 }
    //                 var url = $(obj).attr('data-url');
    //                 var title = $(obj).attr('data-title');
    //                 document.title = title + ' | BLAVITY';
    //                 if (url && (location.pathname !== url || location.pathname == topUrl)) {
    //                     window.history.pushState('', title + ' | Blavity', url);
    //                 }
    //                 return false;
    //             }
    //         });
    //     }
    // }
});

//Click event to scroll to top
$('.scroll_top').click(function() {
    $('html, body').animate({
        scrollTop: 0
    }, 800);
    return false;
});

$('.watch-below').click(function() {
    $('html, body').animate({
        scrollTop: $("#afrotech-video-posts").offset().top
    }, 1000);
    return false;
});
var scrollIndex = 0; //(record of articles scrolled past) Which one we're 'on'


$.fn.isOnScreen = function() {
    var win = $(window);
    var viewport = {
        top: win.scrollTop(),
        left: win.scrollLeft()
    };
    viewport.bottom = viewport.top + win.height();
    var bounds = this.offset();
    if (!bounds)
        return false;
    bounds.bottom = bounds.top + this.outerHeight();
    return (!(viewport.bottom < bounds.top || viewport.top > bounds.bottom));

};

/*$scope.isMobile = function () {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true;
    } //end if

    return false;
};*/


app.controller('headerCTL', ['$scope', '$http', '$filter', '$localStorage', '$sce', '$rootScope', 'apiRequest', function($scope, $http, $filter, $localStorage, $sce, $rootScope, apiRequest) {
    $scope.userdata = '';
    if ($localStorage.token !== undefined || $rootScope.accessToken !== undefined) {
        $scope.userdata = apiRequest.getUserInfo();
        $rootScope.user = apiRequest.getUserInfo();
        $rootScope.isLogin = apiRequest.isUserLogin();
    }

    $scope.postRedirect = function() {
        $localStorage.postRedirect = true;
        if ($rootScope.isLogin) {
            $http({
                method: 'POST',
                url: APIURL + 'articles1/new/',
                headers: {
                    'Content-Type': undefined,
                    'token': $localStorage.token || $rootScope.accessToken
                },
                data: {}
            }).success(function(data) {
                // ARTICLE HAS BEEN CREATED, SEND TO EDIT BY ID
                window.location.assign('/editpost/' + data._id);
            }).error(function(data) {
                console.log('ERROR CREATING ARTICLE');
            });
        } else {
            window.location.assign('/login');
        }
    }

    $scope.openSearchPopup = function() {
        $('#search-bar').addClass('open');
        $('#search-bar > form > input[type="search"]').focus();
    };
    $('#search-bar, #search-bar button.close').on('click keyup', function(event) {
        if (event.target == this || event.target.className == 'close' || event.keyCode == 27) {
            $(this).removeClass('open');
        }
    });
    //for displaying in header
    $scope.todaysDate = new Date();

    $scope.doSearchRedirect = function() {
        window.location.assign('/search/?q=' + $scope.q);
    }
}]);

app.controller('AdCtrl', ['$scope', '$timeout', '$interval', function($scope, $timeout, $interval) {

    // $scope.runInterstitial = true;
    $scope.runInterstitial = false;
    $scope.sideBarHasAd = true;
    $scope.interstitialVisible = false;
    $scope.footerAdVisible = true;
    $scope.interstitialClosable = false;
    $scope.interstitialFilled = false;
    $scope.adCheckTimer = null; //for checking if googletag is ready
    $scope.tagCheckedCount = 0; //how many times the checker has run
    $scope.slotHeight = 0;
    $scope.hasContentHeaderAd = false;
    $scope.hasContentFooterAd = false;

    $scope.timerRunning = false;

    $scope.startTimer = function() {
        $scope.$broadcast('timer-start');
        $scope.timerRunning = true;
    };

    $scope.stopTimer = function() {
        $scope.$broadcast('timer-stop');
        $scope.timerRunning = false;
    };


    if (!!$scope.runInterstitial) {
        $scope.adCheckTimer = $interval(function() {

            if ($scope.tagCheckedCount <= 15) { //only run the check 15 times (about 15 seconds)
                if (!!document.getElementById('interstitial')) {

                    $scope.slotHeight = document.getElementById('interstitial').offsetHeight;

                    $scope.slotHeight = parseInt($scope.slotHeight);

                    if ($scope.slotHeight > 80) {
                        $scope.interstitialFilled = true;
                        //Cancel the Timer.
                        if (angular.isDefined($scope.adCheckTimer)) {
                            $interval.cancel($scope.adCheckTimer);
                        } //end if
                    } else {}
                } //end if has the ad unit

            } else {
                //Cancel the Timer if it still hasn't happened yet.
                if (angular.isDefined($scope.adCheckTimer)) {
                    $interval.cancel($scope.adCheckTimer);
                } //end if
            }

            $scope.tagCheckedCount++;

        }, 1000);

    }

    $scope.$watch('interstitialFilled', function(newValue, oldValue, scope) {
        if (newValue) {
            $scope.interstitialVisible = true;
            $scope.startTimer();

            $timeout(function() {
                $scope.interstitialClosable = true;
            }, 6000);

            $timeout(function() {
                $scope.closeInterstitial();
            }, 12000);

        }
    }, true);


    $scope.closeInterstitial = function() {
        $scope.interstitialVisible = false;
        $('.interstitial-hider').fadeOut();
    }

    $scope.closeFooterAd = function() {
        $scope.footerAdVisible = false;
    }

    //show the '-advertisement-' label if this is on mobile
    if (window.innerWidth <= 500) {
        $scope.hasContentHeaderAd = true;
        $scope.hasContentFooterAd = true;
    }


}]);

var template = '/components/social-buttons.html';

angular.module('StaticRealtimeBlog')
    .directive('socialButtons', ['shareServices', socialButtons]).directive('socialButtonsA', ['shareServices', socialButtons])
    .name;

function socialButtons(shareServices) {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: template,
        link: function(scope, element) {
            scope.dir_class = element.attr('data-class');
            scope.shareFb = function() {
                shareServices.shareFacebook(
                    decodeURIComponent(element.attr('data-title')),
                    element.attr('data-slug'),
                    element.attr('data-picture'),
                    element.attr('data-excerpt'));
            };
            scope.shareTwitter = function() {
                shareServices.shareTwitter(decodeURIComponent(element.attr('data-title')), element.attr('data-slug'),
                    element.attr('data-picture'),
                    element.attr('data-excerpt'),
                    'Check out Blavity for more stuff like this');
            };
            scope.shareMail = function() {
                shareServices.shareMail(decodeURIComponent(element.attr('data-title')), element.attr('data-slug'),
                    element.attr('data-picture'),
                    element.attr('data-excerpt'),
                    'Check out Blavity for more stuff like this');
            };
            scope.shareIOS = function() {
                shareServices.shareIOS(decodeURIComponent(element.attr('data-title')), element.attr('data-slug'),
                    element.attr('data-picture'),
                    element.attr('data-excerpt'),
                    'Check out Blavity for more stuff like this');
            };
            scope.shareAndroid = function() {
                shareServices.shareAndroid(decodeURIComponent(element.attr('data-title')), element.attr('data-slug'),
                    element.attr('data-picture'),
                    element.attr('data-excerpt'),
                    'Check out Blavity for more stuff like this');
            };
        }
    };
}


angular
    .module('StaticRealtimeBlog')
    .directive('affix', affix)
    .directive('stickyad', stickyad);

function affix() {
    return;
    return {
        restrict: 'A',
        link: function(scope, element) {
            element.removeClass('affix');
            var parentContainer = $('main');

            angular.element(window).on('scroll', function() {
                if (parentContainer.find('.affix-start').offset() !== undefined) {
                    var top = parentContainer.find('.affix-start').offset().top;
                    if (parentContainer.find('.affix-end').offset() !== undefined) {
                        var bottom = parentContainer.find('.affix-end').offset().top;
                        if (window.pageYOffset < top || window.pageYOffset >= bottom) {
                            element.removeClass('affix');
                            $('.social-affix-placeholder').height("0px");

                        } else {
                            element.addClass('affix');
                            var article_width = $('article div').width();
                            $('social-buttons.affix').width(article_width + "px");
                            var share_buttons_height = $('social-buttons.affix').height();
                            $('.social-affix-placeholder').height(share_buttons_height + "px");
                        }
                    } else {
                        if (window.pageYOffset < top) {
                            element.removeClass('affix');
                            $('.social-affix-placeholder').height("0px");

                        } else {
                            element.addClass('affix');
                            var article_width = $('article div').width();
                            $('social-buttons.affix').width(article_width + "px");
                            var share_buttons_height = $('social-buttons.affix').height();
                            $('.social-affix-placeholder').height(share_buttons_height + "px");
                        }
                    }

                }
            });
        }
    }
}

function stickyad() {
    return;
    // if(!!isMobileView){
    return {
        restrict: 'A',
        link: function(scope, element) {
            element.removeClass('affix');
            var parentContainer = $(element).parents('section');

            angular.element(window).on('scroll', function() {
                if (parentContainer.find('.stickyad-start').offset() !== undefined) {
                    var top = parentContainer.find('.stickyad-start').offset().top;
                    var innerAdsContainterHeight = parentContainer.find('.stickyad-start > div').outerHeight();

                    if (parentContainer.find('.stickyad-end').offset() !== undefined) {
                        var bottom = parentContainer.find('.stickyad-end').offset().top;
                        if (window.pageYOffset < top || window.pageYOffset >= bottom - innerAdsContainterHeight) {
                            element.removeClass('affix');
                        } else {
                            element.addClass('affix');
                        }
                    } else {
                        if (window.pageYOffset < top) {
                            element.removeClass('affix');
                        } else {
                            element.addClass('affix');
                        }
                    }
                }
            });
        }
    };
    // }


}

angular
    .module('StaticRealtimeBlog')
    .directive('owlCarousel', function() {
        return {
            restrict: 'E',
            transclude: false,
            link: function(scope) {
                scope.initCarousel = function(element) {
                    // provide any default options you want
                    var defaultOptions = {};
                    var customOptions = scope.$eval($(element).attr('data-options'));
                    // combine the two options objects
                    for (var key in customOptions) {
                        defaultOptions[key] = customOptions[key];
                    }
                    // init carousel
                    $(element).owlCarousel(defaultOptions);
                };
            }
        };
    })
    .directive('owlCarouselItem', [function() {
        return {
            restrict: 'A',
            transclude: false,
            link: function(scope, element) {
                // wait for the last item in the ng-repeat then call init
                if (scope.$last) {
                    scope.initCarousel(element.parent());
                }
            }
        };
    }]);
angular
    .module('StaticRealtimeBlog')
    .directive('customeManageButton', function(permissions) {
        return {
            restrict: 'EA',
            scope: {
                isEdittabale: '@',
                isDeletetable: '=',
                isLockable: '=',
                status: '@',
                postslug: '@',
                postid: '@',
                article: '@',
                editingby: '@'
            },
            replace: true,
            template: function(element, attributes) {
                var isPublish = attributes.status == 'publish';
                var temp = '<div><div>';
                if ('isdelete' in attributes && (permissions.hasEditPermission() || !isPublish)) {
                    temp += '<a class="ver-icon b-xs"  ng-click="deletePost()"><i class="fa  fa-trash-o"></i></a>';
                }

                if ('isedit' in attributes && (permissions.hasEditPermission() || !isPublish)) {
                    if (temp)
                        temp += '<hr class="my0 px1 ">';
                    temp += "<a class='ver-icon'  href='/editpost/{{postid}}'><i class='fa  fa-edit'></i></a>";
                }
                if ('islock' in attributes) {
                    if (temp)
                        temp += '<hr class="my0 px1 ">';
                    temp += "<a class='ver-icon' has-permission ng-click='toggleLockArticle()'><i class='fa' ng-class='isEditing ? \"fa-lock\" : \"fa-unlock\"'></i></a>";
                }


                temp += '<hr class="my0 px1 " ng-if="isPublish">';
                temp += "<a class='ver-icon' ng-if='isPublish' ng-click='shareFb()' title='Share to Facebook'><i class='fa fa-facebook'></i></a>";


                temp += '<div class="ui-popup" ng-show="showLockPopup"> <div class="overlay"> <div class="container-popup"> <div class="ui-popup-header"> <div class="ui-popup-title"></div> <div class="popup-close center" ng-click="showLockPopup=false"></div> </div> <div class="ui-popup-body center"> <form class="custom-form-update"> <div class="form-group clearfix" ng-if="isEditing"> <p class="red h5"> This article is currently being editing by {{ editingby | jsonparse | getuserdisplayname}} </p> <p>Are you sure want to unlock this article</p> <div class="col-12 center"> <button class="btn btn-outline bg-light-green get_it_btn btn-lg" ng-click="UnlockArticle()" name="submit">Yes</button> </div> </div> <div class="form-group clearfix" ng-if="!isEditing"> <p>Are you sure want to lock this article</p> <div class="col-12 center"> <button class="btn btn-outline bg-light-green get_it_btn btn-lg" ng-click="lockArticle()" name="submit">Yes</button> </div> </div> </form> </div> <div class="ui-popup-footer"></div> </div> </div> </div>';
                temp += "</div>";

                return temp;
            },
            link: function(scope, element, attrs) {},
            controller: ['$rootScope', '$scope', '$element', '$log', '$q', '$timeout', 'dialogUI', 'deleteServices', 'toastr', 'apiRequest', '$filter', 'shareServices', function($rootScope, $scope, $element, $log, $q, $timeout, dialogUI, deleteServices, toastr, apiRequest, $filter, shareServices) {
                $scope.showLockPopup = false;
                $scope.isPublish = $scope.status == 'publish';

                if ($scope.article && typeof $scope.article !== 'object') {
                    $scope.article = JSON.parse($scope.article);
                }

                if ($scope.article) {
                    var title = $scope.article.title;
                    var slug = $scope.article.slug;
                    var excerpt = $scope.article.excerpt;
                    var fetchimage = $filter('filterAwsFeatureImage');
                    var unsafe = $filter('unsafe');
                    var truncatePostContent = $filter('truncatePostContent');
                    var img = fetchimage($scope.article);
                    var unsafeBody = unsafe($scope.article.body);
                    var truncatePostContentBody = truncatePostContent(unsafeBody);

                    $scope.shareFb = function() {
                        shareServices.shareFacebook(title, slug, img, excerpt, truncatePostContentBody)
                    };
                } else {
                    $scope.shareFb = function() {};
                }

                $scope.toggleLockArticle = function() {

                    var editby = $scope.editingby;
                    if (!editby) {
                        $scope.editingby = undefined;
                    }
                    $scope.showLockPopup = true;
                };
                $scope.lockArticle = function() {
                    if ($scope.postid) {
                        apiRequest.lockArticle($scope.postid).then(function(data) {
                            if (data.data.success) {
                                $scope.editingby = JSON.stringify($rootScope.user);
                                $scope.isEditing = true;
                                toastr.success("This Article Lock Successfully", 'Success');
                            }
                        }).catch(function(error) {
                            toastr.error(error.message, 'Error');
                        });
                    }
                    $scope.showLockPopup = false;
                };
                $scope.UnlockArticle = function() {
                    if ($scope.postid) {
                        apiRequest.UnLockArticle($scope.postid).then(function(data) {
                            if (data.data.success) {
                                $scope.editingby = undefined;
                                $scope.isEditing = false;
                                toastr.success("This Article Un-Locked Successfully", 'Success');
                            }
                        }).catch(function(error) {
                            toastr.error(error.message, 'Error');
                        });
                    }
                    $scope.showLockPopup = false;
                };
                $scope.deletePost = function() {
                    dialogUI.confirmUI('Confirmation', 'Are you sure you want to Delete this?', function() {
                        deleteServices.deletePost($scope.postid).then(function() {
                            angular.element('#post_' + $scope.postid).remove();
                            toastr.success('Article Deleted Successfully.');
                            $scope.$parent.getNewAfterDelete($scope.article);
                        }).catch(function(response) {
                            if (!response.data.success)
                                toastr.error(response.data.msg);
                        });
                    }, function() {});
                };

                if ($scope.editingby) {
                    $scope.editingby = typeof $scope.editingby !== 'object' && typeof $scope.editingby !== 'string' ? JSON.parse($scope.editingby) : $scope.editingby;
                    $scope.isEditing = $scope.editingby ? true : false;
                }
            }]

        }
    });

angular
    .module('StaticRealtimeBlog')
    .directive('addSeries', function() {
        return {
            restrict: 'EA',
            replace: true,
            template: function(element, attributes) {
                var temp = '<div><a ng-click="showAddSeries=true;"><i class="fa fa-plus"></i></a><div>';
                temp += '<div class="ui-popup" ng-show="showAddSeries"><div class="overlay"><div class="container-popup"><div class="ui-popup-header"><div class="ui-popup-title"></div><div class="popup-close center" ng-click="showAddSeries=false"></div></div><div class="ui-popup-body center"><h3>Add New Series</h3><form class="custom-form-update"><div class="clearfix"><label class="sm-col sm-col-2 xs-col-5 h5 py1 pr1 ">Series Name</label><div class="sm-col sm-col-8 xs-col-7"><input type="text" required name="series" placeholder="Series Name"class="form-control no-radius"ng-model="seriesName"></div><label class="h6">Minimum 6 char</label></div><div class="clearfix"><div class="sm-col sm-col-2 md-col-2">&nbsp;</div><div class="sm-col sm-col-8 md-col-8 mt1"><button ng-click="saveSeries()" type="submit" ng-disabled="seriesName.length < 4"class="btn btn-outline bg-light-green no-radius sm-col sm-col-6 xs-col-6">Submit</button><button ng-click="resetForm()" type="reset"class="btn btn-outline bg-light-green no-radius sm-col sm-col-6 xs-col-6">Cancel</button></div></div></form></div><div class="ui-popup-footer"></div></div></div></div>';
                temp += "</div>";

                return temp;
            },
            link: function(scope, element, attrs) {},
            controller: ['$rootScope', '$scope', '$element', '$log', '$q', '$timeout', 'dialogUI', 'deleteServices', 'toastr', 'apiRequest', function($rootScope, $scope, $element, $log, $q, $timeout, dialogUI, deleteServices, toastr, apiRequest) {
                $scope.seriesName = '';
                $scope.saveSeries = function() {
                    if ($scope.seriesName.length > 4) {
                        apiRequest.addSeries($scope.seriesName).then(function(data) {
                            if (data.status) {
                                toastr.success("Series added successfully", "success");
                                $scope.resetForm();
                            } else {
                                toastr.error("Error in Adding Series", "error");
                            }
                        }).
                        catch(function(err) {
                            toastr.error("Error in Adding Series", "error");
                        })
                    }
                };
                $scope.resetForm = function() {
                    $scope.seriesName = '';
                    $scope.showAddSeries = false;
                };
            }]

        }
    });
var subscriberAsideTemplate = '/components/subscriber-aside.html';

angular
    .module('StaticRealtimeBlog')
    .directive('subscriberAside', function(permissions) {
        return {
            restrict: 'EA',
            scope: true,
            replace: true,
            templateUrl: subscriberAsideTemplate,
            link: function(scope, element, attrs) {},
            controller: ['$rootScope', '$scope', 'toastr', 'apiRequest', function($rootScope, $scope, toastr, apiRequest) {
                $scope.errorMsg = '';
                $scope.isSuccess = false;
                $scope.subscribe = function(e) {
                    $scope.isSuccess = false;
                    if (e.email) {
                        if (e.name == undefined) {
                            e.name = 'unknown';
                        }
                        $scope.errorMsg = '';
                        apiRequest.addSubscriber(e.email, e.name)
                            .then(function(res) {
                                $scope.isSuccess = true;
                                toastr.success("You are added to list", 'success');
                            }).catch(function(err) {
                                $scope.isSuccess = false;
                                toastr.error("Error while adding you on list", 'error');
                            })
                    } else {
                        $scope.errorMsg = 'Email/Name is required';
                    }
                }

            }]
        }
    });

var subscriberBannerTemplate = '/components/subscriber-banner.html';

angular
    .module('StaticRealtimeBlog')
    .directive('subscriberBanner', function(permissions) {
        return {
            restrict: 'EA',
            scope: true,
            replace: true,
            templateUrl: subscriberBannerTemplate,
            link: function(scope, element, attrs) {},
            controller: ['$rootScope', '$scope', 'toastr', 'apiRequest', function($rootScope, $scope, toastr, apiRequest) {
                $scope.errorMsg = '';
                $scope.isSuccess = false;
                $scope.subscribe = function(e) {
                    $scope.isSuccess = false;
                    if (e.email && e.name) {
                        $scope.errorMsg = '';
                        apiRequest.addSubscriber(e.email, e.name)
                            .then(function(res) {
                                $scope.isSuccess = true;
                                toastr.success("You are added to list", 'success');
                            }).catch(function(err) {
                                $scope.isSuccess = false;
                                toastr.error("Error while adding you on list", 'error');
                            })
                    } else {
                        $scope.errorMsg = 'Email/Name is required';
                    }
                }

            }]
        }
    });


    app.controller('VideoPostCtrl', ['$scope', '$http', 'apiRequest', function ($scope, $http, apiRequest) {
        $scope.items1 = [1, 2, 3, 4, 5];
        $scope.items2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        $scope.videoHead = [];
        $scope.videoAside = [];
        $scope.videoLatest1 = [];
        $scope.videoLatest2 = [];
        $scope.videoLatest3 = [];
        $scope.videoLatest4 = [];
        $scope.videoLatest5 = [];
        $scope.video_post = [];
        $scope.video_post=[];
        $scope.limit=12;
        $scope.offset=21;
        $scope.showLoadMore=false;
        $http.get(APIURL + 'articles/type/video/21/0').then(function (results) {
            if (results.status === 200) {
                $scope.videoHead = results.data.slice(0, 1);
                // $scope.videoAside = results.data.slice(1, 3);
                $scope.videoLatest1 = results.data.slice(0, 21);
    
            }
        });
    
        $scope.getVideoPost= function(){
            $http.get(APIURL + 'articles/type/video/'+$scope.limit+'/'+$scope.offset).then(function (results) {
                if (results.status === 200) {
                    if(results.data && results.data.length){
                        $scope.video_post=$scope.video_post.concat(results.data);
                        $scope.showLoadMore=true;
                        if(results.data.results< $scope.limit){
                            $scope.showLoadMore=false;
                        }
                        else{
                            $scope.offset+=$scope.limit;
                        }
                    }
                    else{
                        $scope.showLoadMore=false;
                    }
                }
                else{
                    $scope.showLoadMore=false;
                }
            });
        };
    
        $scope.getVideoPost();
        $scope.playlist=[];
        apiRequest.getTopJwPlayerVideo(10,1).then(function(data){
          if(angular.element('#myElement').length>0){
            $scope.playlist=data.data;
            var playerInstance = jwplayer("myElement");
            playerInstance.setup(
              {
                "playlist": data.data,
                "aspectratio": "16:9",
                "width": "100%",
                "autostart": false
              }).on('play', function(index){
              itemMonitor(playerInstance.getPlaylistIndex());
            });
            function playVideos(index){
              jwplayer().playlistItem(index);
              itemMonitor(index);
            }
            function itemMonitor(index)
            {
              var title='<span>'+playerInstance.getPlaylist()[index].title+'</span><br>';
              var description=playerInstance.getPlaylist()[index].description;
              document.getElementById('nowplaying').innerHTML=title+description;
              document.getElementById('nowplaying').style.display = 'block';
            }
          }
        })
    
    
    }]);
    