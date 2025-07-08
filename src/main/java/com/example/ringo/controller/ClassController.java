package com.example.ringo.controller;

import com.example.ringo.command.ClassVO;
import com.example.ringo.command.UsersVO;
import com.example.ringo.room.service.ClassService;
import com.example.ringo.users.mapperJava.UsersMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/classes")
public class ClassController {

    @Autowired
    private ClassService classService;

    @Autowired
    private UsersMapper usersMapper;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String createClass(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("price") BigDecimal price,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "image", required = false) MultipartFile imageFile,
            @RequestParam("recruitment_post_id") String recruitmentPostId,
            HttpSession session
    ) throws IOException {
        UsersVO loginUser = (UsersVO) session.getAttribute("loginUser");
        if (loginUser == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        String userId = loginUser.getUserId();

        ClassVO classVO = new ClassVO();

        // UUID로 roomId 생성
        classVO.setRoomId(UUID.randomUUID().toString());
        classVO.setTitle(title);
        classVO.setDescription(description);
        classVO.setPrice(price);
        classVO.setPassword(password);
        classVO.setUserId(userId);
        classVO.setRecruitmentPostId(Integer.parseInt(recruitmentPostId));

        if (imageFile != null && !imageFile.isEmpty()) {
            classVO.setImageUrl(imageFile.getBytes());
            String contentType = imageFile.getContentType(); // 예: image/png
            if (contentType != null) {
                classVO.setImageType(contentType.substring(contentType.lastIndexOf("/") + 1)); // png
            }
        }

        classService.createClass(classVO);
        return classVO.getRoomId();
    }


    @GetMapping
    public List<Map<String, Object>> getUserClasses(HttpSession session) {

        UsersVO loginUser = (UsersVO) session.getAttribute("loginUser");
        if (loginUser == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        String userId = loginUser.getUserId();
        List<ClassVO> classList = classService.getClassesByUserId(userId); // 🔄 수정된 부분

        List<Map<String, Object>> result = new ArrayList<>();
        for (ClassVO vo : classList) {
            Map<String, Object> map = new HashMap<>();
            map.put("roomId", vo.getRoomId());
            map.put("title", vo.getTitle());
            map.put("description", vo.getDescription());
            map.put("price", vo.getPrice());
            map.put("password", vo.getPassword());

            if (vo.getImageUrl() != null && vo.getImageType() != null) {
                String base64Image = Base64.getEncoder().encodeToString(vo.getImageUrl());
                map.put("imageUrl", "data:image/" + vo.getImageType() + ";base64," + base64Image);
            } else {
                map.put("imageUrl", null);
            }

            result.add(map);
        }

        return result;
    }

    @PutMapping(value = "/{roomId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void updateClass(
            @PathVariable String roomId,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("price") BigDecimal price,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "image", required = false) MultipartFile imageFile,
            HttpSession session
    ) throws IOException {
        UsersVO loginUser = (UsersVO) session.getAttribute("loginUser");
        if (loginUser == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        String userId = loginUser.getUserId();

        ClassVO classVO = new ClassVO();
        classVO.setRoomId(roomId);
        classVO.setTitle(title);
        classVO.setDescription(description);
        classVO.setPrice(price);
        classVO.setPassword(password);
        classVO.setUserId(userId);

        if (imageFile != null && !imageFile.isEmpty()) {
            classVO.setImageUrl(imageFile.getBytes());
            String contentType = imageFile.getContentType();
            if (contentType != null) {
                classVO.setImageType(contentType.substring(contentType.lastIndexOf("/") + 1));
            }
        }

        classService.updateClass(classVO);
    }

    @DeleteMapping("/{roomId}")
    public void deleteClass(@PathVariable String roomId) {
        classService.deleteClass(roomId);
    }


    @GetMapping("/my-classes")
    public List<Map<String, Object>> getMyRecruitmentPosts(HttpSession session) {
        UsersVO loginUser = (UsersVO) session.getAttribute("loginUser");
        if (loginUser == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        String userId = loginUser.getUserId();

        // 1. userId(문자열)로 user_primary_id(int) 조회
        Integer userPrimaryId = usersMapper.selectUserPrimaryIdByUserId(userId);
        if (userPrimaryId == null) {
            throw new RuntimeException("유저 PK를 찾을 수 없습니다.");
        }

        // 2. user_primary_id(int)로 recruitment_post 조회
        List<Map<String, Object>> postList = classService.getRecruitmentPostsByUserId(userPrimaryId);

        return postList;
    }

}
