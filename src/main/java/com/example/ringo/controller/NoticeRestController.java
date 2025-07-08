package com.example.ringo.controller;

import com.example.ringo.command.NoticeVO;
import com.example.ringo.notice.service.NoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notice")
public class NoticeRestController {

    @Autowired
    private NoticeService noticeService;

    public NoticeRestController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    @GetMapping("/list")
    public Map<String, Object> getNoticeList(@RequestParam(defaultValue = "1") int page,
                                             @RequestParam(defaultValue = "") String keyword) {
        int amount = 10;
        int start = (page - 1) * amount;


        List<NoticeVO> list = noticeService.getNoticeListPaging(start, amount, keyword);

        int total = noticeService.getTotalNoticeCount(keyword);

        Map<String, Object> response = new HashMap<>();
        response.put("noticeList", list);
        response.put("total", total);

        return response;
    }

}
