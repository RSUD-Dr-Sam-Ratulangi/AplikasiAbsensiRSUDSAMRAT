package rsud.samrat.springboot.Utility;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import org.springframework.web.multipart.MultipartFile;

public class ImageCompressionUtil {

    public static byte[] compressImage(MultipartFile imageFile, int targetWidth, int targetHeight, float compressionQuality) throws IOException {
        BufferedImage originalImage = ImageIO.read(new ByteArrayInputStream(imageFile.getBytes()));
        BufferedImage compressedImage = resizeAndCompress(originalImage, targetWidth, targetHeight, compressionQuality);

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ImageIO.write(compressedImage, "jpg", outputStream);

        return outputStream.toByteArray();
    }

    public static BufferedImage resizeAndCompress(BufferedImage originalImage, int targetWidth, int targetHeight, float compressionQuality) {
        BufferedImage resizedImage = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_RGB);
        resizedImage.getGraphics().drawImage(originalImage.getScaledInstance(targetWidth, targetHeight, java.awt.Image.SCALE_SMOOTH), 0, 0, null);

        // Apply compression settings
        ByteArrayOutputStream compressedOutput = new ByteArrayOutputStream();
        try {
            ImageIO.write(resizedImage, "jpg", compressedOutput);
        } catch (IOException e) {
            // Handle compression exception
        }
        return resizedImage;
    }
}
