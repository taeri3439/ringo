package com.example.ringo.controller;

import com.example.ringo.command.CommentVO;
import com.example.ringo.command.PostVO;
import com.example.ringo.command.UsersVO;
import com.example.ringo.community.service.CommunityService;
import com.example.ringo.config.S3Uploader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/community")
public class CommunityController {

    @Autowired
    private CommunityService communityService;

    @Autowired
    private S3Uploader s3Uploader;

    @GetMapping("/communitylist")
    public String communityList(Model model) {
        model.addAttribute("pageName", "community");
        return "community";
    }

    @GetMapping("/getPost")
    @ResponseBody
    public List<PostVO> getPost(@RequestParam(required = false) String category,
                                @RequestParam(required = false) String search,
                                @RequestParam int size,
                                @RequestParam int offset) {
        return communityService.getPost(category, search, size, offset);
    }

    @GetMapping("/getPostCount")
    @ResponseBody
    public Integer getPostCount(@RequestParam(required = false) String category,
                                @RequestParam(required = false) String search) {
        return communityService.getPostCount(category, search);
    }

    @GetMapping("/communitydetail")
    public String communityDetail(@RequestParam("postId") String postId,Model model) {
        model.addAttribute("pageName", "communitydetail");
        return "community";
    }

    @GetMapping("/getOnePost")
    @ResponseBody
    public PostVO getOnePost(@RequestParam("postId") int postId) {
        return communityService.getOnePost(postId);
    }

    @GetMapping("/communitywrite")
    public String communityWrite(Model model) {
        model.addAttribute("pageName", "communitywrite");
        return "community";
    }


//    @PostMapping("/writepost")
//    @ResponseBody
//    public ResponseEntity<String> communityWrite(@RequestBody PostVO postVO) {
//        communityService.writePost(postVO);
//        return ResponseEntity.ok("success");
//    }

    @PostMapping("/writepost")
    @ResponseBody
    public ResponseEntity<String> communityWrite(
            @RequestParam("postTitle") String title,
            @RequestParam("postContent") String content,
            @RequestParam("postType") String type,
            @RequestParam("userPrimaryId") int userId,
            @RequestParam(value = "images", required = false) List<MultipartFile> images
    ) {
        PostVO postVO = new PostVO();
        postVO.setPostTitle(title);
        postVO.setPostContent(content);
        postVO.setPostType(type);
        postVO.setUserPrimaryId(userId);

        List<String> imageUrls = new ArrayList<>();
        if (images != null && !images.isEmpty()) {
            for (MultipartFile file : images) {
                String url = s3Uploader.upload(file); // UUID 붙인 파일명
                imageUrls.add(url);
            }
        }
        postVO.setImageUrls(imageUrls);

        communityService.writePost(postVO);

        return ResponseEntity.ok("success");
    }


    @PostMapping("/writeComment")
    @ResponseBody
    public void writeComment(@RequestBody CommentVO commentVO) {
        communityService.writeComment(commentVO);
    }

    @GetMapping("/getAllParentComments")
    @ResponseBody
    public List<CommentVO> getAllParentComment(@RequestParam int postId) {
        return communityService.getAllParentComments(postId);
    }

    @GetMapping("/getChildComments")
    @ResponseBody
    public List<CommentVO> getChildComments(@RequestParam int postId,
                                            @RequestParam int commentParentId) {
        return communityService.getChildComments(postId, commentParentId);
    }

}
