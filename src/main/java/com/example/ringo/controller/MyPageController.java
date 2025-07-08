package com.example.ringo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/mypage")
public class MyPageController {

    @GetMapping("/mypageuser") //.do 해주세요
    public String myPageUser(Model model) {
        model.addAttribute("pageName", "mypage");
        System.out.println("뷰이름:" + "mypageuser");

        return "mypage"; //언제나 view화면으로 이동합니다.
    }

    @GetMapping("/mypagegosu") //.do 해주세요
    public String myPageGosu(Model model) {
        model.addAttribute("pageName", "mypagegosu");
        System.out.println("뷰이름:" + "mypagegosu");

        return "mypage"; //언제나 view화면으로 이동합니다.
    }


//    @GetMapping("/MyPage/{pageName}") //.do 해주세요
//    public String page(@PathVariable String pageName, Model model) {
//        model.addAttribute("pageName", pageName);
//        System.out.println("뷰이름:" + pageName);
//
//        return pageName; //언제나 view화면으로 이동합니다.
//    }

}




