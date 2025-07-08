package com.example.ringo.controller;

import com.example.ringo.command.QnaVO;
import com.example.ringo.qna.service.QnaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/qna")
public class QnaController {

    @Autowired
    private QnaService qnaService;

    public QnaController(QnaService qnaService) {
        this.qnaService = qnaService;
    }

    @GetMapping("/qnalist") //.do 해주세요
    public String qnaList(Model model) {
        model.addAttribute("pageName", "qnalist");
        System.out.println("뷰이름:" + "qnalist");

        return "qnalist"; //언제나 view화면으로 이동합니다.
    }

    @GetMapping("/qnawrite") //.do 해주세요
    public String qnaWrite(Model model) {
        model.addAttribute("pageName", "qnawrite");
        System.out.println("뷰이름:" + "qnawrite");

        return "qnawrite"; //언제나 view화면으로 이동합니다.
    }

    @PostMapping("/qnaForm")
    public String insertQna(QnaVO vo) {

//        vo.setUserPrimaryId; (로그인유저ID)
        System.out.println("전달된 QnaVO: " + vo);
        qnaService.insertQna(vo);
        return "redirect:/qna/qnalist";

    }



}