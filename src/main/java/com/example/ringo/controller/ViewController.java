package com.example.ringo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class ViewController {

    @GetMapping("/{pageName}.do") //.do 해주세요
    public String page(@PathVariable String pageName, Model model) {
        model.addAttribute("pageName", pageName);
        System.out.println("뷰이름:" + pageName);

        return "view"; //언제나 view화면으로 이동합니다.
    }

    @GetMapping("/{pageName}.do/{roomId}")
    public String pageWithRoom(@PathVariable String pageName,
                               @PathVariable String roomId,
                               Model model) {
        model.addAttribute("pageName", pageName);
        model.addAttribute("roomId", roomId);
        System.out.println("뷰이름:" + pageName + ", roomId:" + roomId);
        return "view";
    }

}
