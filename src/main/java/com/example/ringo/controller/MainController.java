package com.example.ringo.controller;

import com.example.ringo.command.RecruitmentPostVO;
import com.example.ringo.command.UsersVO;
import com.example.ringo.lecture.service.LectureService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpSession;
import java.util.List;

@Controller
public class MainController {

    private final LectureService lectureService;

    public MainController(LectureService lectureService) {
        this.lectureService = lectureService;
    }

    @GetMapping("/")
    public String firstMainPage(Model model){
        model.addAttribute("pageName", "main");
        return "main";
    }

    @GetMapping("/main")
    public String mainPage(Model model , HttpSession session){
        model.addAttribute("pageName", "main");

        UsersVO loginUser = (UsersVO) session.getAttribute("loginUser");
        model.addAttribute("loginUser", loginUser);


        return "main";
    }





}