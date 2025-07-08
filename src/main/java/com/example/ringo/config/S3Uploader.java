package com.example.ringo.config;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Log4j2
public class S3Uploader {

//    private final AmazonS3 amazonS3Client;
//
//    @Value("${cloud.aws.s3.bucket}")
//    public String bucket; // S3 버킷 이름
//
//    // S3로 파일 업로드하기
//    public String upload(MultipartFile multipartFile) {
//        String originalFileName = multipartFile.getOriginalFilename();
//        String uuid = UUID.randomUUID().toString();
//        String newFileName = uuid + "_" + originalFileName;
//
//        File file = convertMultipartFileToFile(multipartFile);
//        String uploadedUrl = putS3(file, newFileName);
//        removeOriginalFile(file);
//        return uploadedUrl;
//    }
//
//    private File convertMultipartFileToFile(MultipartFile multipartFile) {
//        try {
//            File convFile = File.createTempFile("upload", multipartFile.getOriginalFilename());
//            multipartFile.transferTo(convFile);
//            return convFile;
//        } catch (IOException e) {
//            throw new RuntimeException("파일 변환 실패", e);
//        }
//    }
//    // S3로 업로드
//    private String putS3(File uploadFile, String fileName)throws RuntimeException
//    {
//        amazonS3Client.putObject(new PutObjectRequest(bucket, fileName,
//                uploadFile)
//                .withCannedAcl(CannedAccessControlList.PublicRead));
//        return amazonS3Client.getUrl(bucket, fileName).toString();
//    }
//    //S3 업로드 후 원본 파일 삭제
//    private void removeOriginalFile(File targetFile) {
//        if (targetFile.exists() && targetFile.delete()) {
//            log.info("File delete success");
//            return;
//        }
//        log.info("fail to remove");
//    }
//    public void removeS3File(String fileName){
//        final DeleteObjectRequest deleteObjectRequest = new
//                DeleteObjectRequest(bucket, fileName);
//        amazonS3Client.deleteObject(deleteObjectRequest);
//    }
private final AmazonS3 amazonS3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    public String upload(MultipartFile multipartFile) {
        String originalFileName = multipartFile.getOriginalFilename();
        String uuid = UUID.randomUUID().toString();
        String newFileName = uuid + "_" + originalFileName;

        try {
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(multipartFile.getSize());
            metadata.setContentType(multipartFile.getContentType());

            amazonS3Client.putObject(
                    new PutObjectRequest(bucket, newFileName, multipartFile.getInputStream(), metadata)
                            .withCannedAcl(CannedAccessControlList.PublicRead)
            );

            log.info("S3 업로드 완료: {}", newFileName);

            return amazonS3Client.getUrl(bucket, newFileName).toString();

        } catch (IOException e) {
            log.error("S3 업로드 실패", e);
            throw new RuntimeException("S3 업로드 중 오류 발생", e);
        }
    }

    public void removeS3File(String fileName) {
        amazonS3Client.deleteObject(new DeleteObjectRequest(bucket, fileName));
    }
}
