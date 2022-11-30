package com.example.farmhub.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.hibernate.validator.constraints.Length;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "farmImage")
@Builder
public class ImageData {


    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @OneToOne
    private UserModel user;

    @Column(nullable = false)
    @NotBlank(message = "title should not be blank")
    @Length(max = 100,message = "Title should not be more than 100 characters")
    private String description;

    @Lob
    @Column(name = "farmImage", length = 1000)
    private byte[] farmImage;

}
