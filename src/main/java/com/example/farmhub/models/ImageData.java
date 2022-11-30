package com.example.farmhub.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "farmImage")
public class ImageData {


    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private UserModel user;

    private String type;

    @Lob
    @Column(name = "farmImage", length = 1000)
    private byte[] farmImage;

}
