package com.example.ringo.controller;

import com.example.ringo.command.QnaVO;
import com.example.ringo.qna.service.QnaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/qna")
public class QnaRestController {

    @Autowired
    private QnaService qnaService;

    @GetMapping("/list")
    public Map<String, Object> getQnaList(@RequestParam(defaultValue = "1") int page,
                                          @RequestParam(defaultValue = "") String keyword) {

        int amount = 10;
        int start = (page - 1) * amount;

        List<QnaVO> qnaList = qnaService.getQnaListPaging(start, amount, keyword);
        int total = qnaService.getTotalQnaCount(keyword);

        Map<String, Object> response = new HashMap<>();
        response.put("qnaList", qnaList);
        response.put("total", total);

        return response;
    }


}
